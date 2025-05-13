import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Audit } from 'src/domain/audit/audit';
import {
  BOOK_STATUS,
  CRUD_ACTION,
  DEFAULT_CACHE_TIME_TO_LIVE,
  MAX_BORROW_LIMIT,
  PAGINATION,
  TYPES,
  USER_ROLE,
} from 'src/infrastucture/constant';
import { IContextAwareLogger } from 'src/infrastucture/logger';
import { IRedisService } from 'src/infrastucture/redis/redisInterface';
import { IAudit } from 'src/interface/audit.interface';
import { IBookRepository } from 'src/interface/repositories/book.repositories.interface';
import {
  IBorrowedBookDashboard,
  IBorrowedBookDashboardResponse,
  IBorrowedBookRepository,
  ITrendingBook,
} from 'src/interface/repositories/borrowedBook.repositories.interface';
import { IBookService } from 'src/interface/service/book.service.interface';
import {
  IBorrowBook,
  IBorrowBookInput,
  IBorrowedBookData,
  IBorrowedBookListInput,
  IBorrowedBookListResponse,
  IBorrowedBookService,
  IIncomingDueResponse,
  IRecentActivityResponse,
  IReturnBookInput,
} from 'src/interface/service/borrowedBook.service.interface';
import { extractDateFromISOString, pagination } from 'src/utilities/utils';
import { BookParser } from '../book/book.parser';
import { BorrowedBook } from './borrowedBook';
import { BorrowedBookParser } from './borrowedBook.parser';

@Injectable()
export class BorrowedBookService implements IBorrowedBookService {
  constructor(
    @Inject(TYPES.IApplicationLogger)
    private readonly _logger: IContextAwareLogger,
    @Inject(TYPES.IBookRepository)
    private readonly _bookRepository: IBookRepository,
    @Inject(TYPES.IBorrowedBookRepository)
    private readonly _borrowedBookRepository: IBorrowedBookRepository,
    @Inject(TYPES.IRedisService)
    protected readonly _redisCacheService: IRedisService,
    @Inject(TYPES.IBookService)
    protected readonly _bookServie: IBookService,
  ) {}

  async borrowBook(
    input: IBorrowBookInput,
    email: string,
  ): Promise<IBorrowBook> {
    try {
      const { studentId, bookId } = input;
      const book = await this._bookRepository.findOne({
        where: { id: bookId },
      });
      if (!book || book.quantity <= 0)
        throw new BadRequestException('Book not available');

      await this._validateBorrowingRules(studentId, bookId);

      const auditProps: IAudit = Audit.createAuditProperties(
        email,
        CRUD_ACTION.create,
      );
      const audit: Audit = Audit.create(auditProps).getValue();

      const newBorrowedBook = BorrowedBook.create({
        borrow_date: new Date().toISOString(),
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: BOOK_STATUS.BORROWED,
        user_id: studentId,
        book_id: bookId,
        audit,
      }).getValue();

      const savedBorrowedBook: BorrowedBook =
        await this._borrowedBookRepository.save(newBorrowedBook);

      if (!savedBorrowedBook) {
        throw new BadRequestException(`Unable borrow this book`);
      }

      book.quantity -= 1;
      await this._bookRepository.save(book);

      const borrowed = BookParser.updatedBook(book);

      const activeBorrows =
        await this._borrowedBookRepository.getActiveBorrows(studentId);

      await this._deleteBorrowCache();
      await this._bookServie.deleteBookPageCache();

      return {
        book: borrowed,
        dueDate: extractDateFromISOString(savedBorrowedBook.due_date),
        status: savedBorrowedBook.status,
        remainingBookCanBorrow: MAX_BORROW_LIMIT - activeBorrows,
      };
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  private async _validateBorrowingRules(
    studentId: string,
    bookId: string,
  ): Promise<void> {
    try {
      const activeBorrows =
        await this._borrowedBookRepository.getActiveBorrows(studentId);

      if (activeBorrows >= MAX_BORROW_LIMIT) {
        throw new ForbiddenException(
          'You have reached the maximum borrow limit.',
        );
      }

      const overdueBooks =
        await this._borrowedBookRepository.getOverdueBooks(studentId);

      if (overdueBooks.length > 0) {
        throw new BadRequestException(
          'You have overdue books. Please return them before borrowing new ones.',
        );
      }

      const duplicateBorrow =
        await this._borrowedBookRepository.getDuplicateBorrow(
          studentId,
          bookId,
        );

      if (duplicateBorrow) {
        throw new ConflictException('You already borrowed this book.');
      }
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async returnBook(
    input: IReturnBookInput,
    email: string,
  ): Promise<IBorrowedBookData> {
    try {
      const borrowedBook = await this._borrowedBookRepository.findOne({
        where: { id: input.borrowedBookId },
        relations: ['user', 'book'],
      });

      if (
        borrowedBook.status === BOOK_STATUS.RETURNED ||
        (borrowedBook.status === BOOK_STATUS.LOSTED && borrowedBook.return_date)
      ) {
        throw new BadRequestException('You already return this book');
      }

      const book = await this._bookRepository.findOne({
        where: { id: borrowedBook.book_id },
      });

      if (!borrowedBook) {
        throw new NotFoundException('There is no book borrowed in record');
      }

      const auditProps: IAudit = Audit.createAuditProperties(
        email,
        CRUD_ACTION.update,
      );
      const audit: Audit = Audit.create(auditProps).getValue();

      const updateStatus = BorrowedBook.update(
        {
          status: input.status,
          fine: input.fine,
          return_date: new Date().toISOString(),
        },
        borrowedBook,
        audit,
      );

      const updatedStatus: BorrowedBook =
        await this._borrowedBookRepository.save(updateStatus);

      book.quantity += 1;
      await this._bookRepository.save(book);

      if (!updatedStatus) {
        throw new InternalServerErrorException(
          `Failed to update status borrowed book`,
        );
      }

      await this._deleteBorrowCache();
      await this._bookServie.deleteBookPageCache();

      return BorrowedBookParser.bookById(updatedStatus);
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async getBorrowBookByStudentId(
    input: IBorrowedBookListInput,
  ): Promise<IBorrowedBookListResponse> {
    try {
      const { pageNum, pageSize, statuses, search, studentId } = input;

      const defaultPageSize = PAGINATION.defaultRecords;
      input.pageSize = pageSize ?? defaultPageSize;

      const cacheKey = `borrowed_book_page${pageNum}_limit${pageSize}_searchBy${search}_filterBy${statuses}_studentId${studentId}`;

      const cachedData = await this._getCachedData(cacheKey);

      if (cachedData && statuses.length > 0) {
        return cachedData;
      }

      const borrows =
        await this._borrowedBookRepository.listBorrowedBookByPagination(input);

      const parsedBorrows = BorrowedBookParser.listBook(borrows.data);

      const paginatedBorrows: IBorrowedBookListResponse = pagination(
        parsedBorrows,
        input,
        borrows.total,
      ) as unknown as IBorrowedBookListResponse;

      await this._cacheResponse(paginatedBorrows, cacheKey);

      return paginatedBorrows;
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async dashboardCard(
    userId: string,
    role: string,
  ): Promise<IBorrowedBookDashboardResponse> {
    try {
      let borrowedBook: IBorrowedBookDashboard;
      let totalAvailableBook: number;
      if (role === USER_ROLE.STUDENT) {
        borrowedBook =
          await this._borrowedBookRepository.studentBorrowedBookDashboard(
            userId,
          );
        totalAvailableBook = 0;
      } else {
        borrowedBook =
          await this._borrowedBookRepository.borrowedBookDashboard();
        totalAvailableBook = await this._bookRepository.totalAvailableBook();
      }

      return { totalAvailableBook, ...borrowedBook };
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async trendingBook(): Promise<ITrendingBook[]> {
    try {
      const trending = await this._borrowedBookRepository.getTrendingBooks();
      return trending;
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async recentActivities(): Promise<IRecentActivityResponse[]> {
    try {
      const recent = await this._borrowedBookRepository.getRecentActivity();

      return BorrowedBookParser.recentActivity(recent);
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async recentActivitiesByStudent(
    userId: string,
  ): Promise<IRecentActivityResponse[]> {
    try {
      const recent =
        await this._borrowedBookRepository.getRecentActivityByStudent(userId);

      return BorrowedBookParser.recentActivity(recent);
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async incomingDue(): Promise<IIncomingDueResponse[]> {
    try {
      const recent = await this._borrowedBookRepository.getIncomingDue();

      return BorrowedBookParser.incomingDue(recent);
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async incomingDueByStudent(userId: string): Promise<IIncomingDueResponse[]> {
    try {
      const recent =
        await this._borrowedBookRepository.getIncomingDueByStudent(userId);

      return BorrowedBookParser.incomingDue(recent);
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async getAllBorrowedBook(
    input: IBorrowedBookListInput,
  ): Promise<IBorrowedBookListResponse> {
    try {
      const { pageNum, pageSize } = input;

      const defaultPageSize = PAGINATION.defaultRecords;
      input.pageSize = pageSize ?? defaultPageSize;

      const cacheKey = `borrowed_book_page${pageNum}_limit${pageSize}`;

      const cachedData = await this._getCachedData(cacheKey);

      if (cachedData) {
        return cachedData;
      }

      const list =
        await this._borrowedBookRepository.listBorrowedBookByPagination(input);

      const parsedList = BorrowedBookParser.listBook(list.data);

      const paginatedList: IBorrowedBookListResponse = pagination(
        parsedList,
        input,
        list.total,
      ) as unknown as IBorrowedBookListResponse;

      await this._cacheResponse(paginatedList, cacheKey);

      return paginatedList;
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async getBorrowedBookById(id: string): Promise<IBorrowedBookData> {
    try {
      const borrowedBook = await this._borrowedBookRepository.findOne({
        where: { id },
        relations: ['user', 'book'],
      });

      if (!borrowedBook) {
        throw new NotFoundException(`Borrowed book with ID ${id} not found`);
      }

      const bookParse = BorrowedBookParser.bookById(borrowedBook);
      return bookParse;
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  private async _getCachedData(cacheKey: string): Promise<any> {
    return (await this._redisCacheService.get(cacheKey)) as any;
  }

  private async _cacheResponse(data: any, cacheKey: string): Promise<void> {
    await this._redisCacheService.set(
      cacheKey,
      data,
      DEFAULT_CACHE_TIME_TO_LIVE,
    );
  }

  private async _deleteBorrowCache(): Promise<void> {
    const keys = await this._redisCacheService.keys('*borrowed_book_page*');
    if (keys.length > 0) {
      await this._redisCacheService.deleteMany(keys);
    }
  }
}
