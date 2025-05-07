import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Audit } from 'src/domain/audit/audit';
import {
  CRUD_ACTION,
  DEFAULT_CACHE_TIME_TO_LIVE,
  PAGINATION,
  TYPES,
} from 'src/infrastucture/constant';
import { IContextAwareLogger } from 'src/infrastucture/logger';
import { IRedisService } from 'src/infrastucture/redis/redisInterface';
import { IAudit } from 'src/interface/audit.interface';
import {
  IBookRepository,
  IListBooByPaginationResponse,
} from 'src/interface/repositories/book.repositories.interface';
import {
  IAddBookResponse,
  IAddNewBookInput,
  IAddOneBookResponse,
  IBookService,
  IDeleteBookResponse,
  IFindBookData,
  IFindBookInput,
  IFindBookResponse,
  IListBookInpput,
  IUpdateBook,
} from 'src/interface/service/book.service.interface';
import { pagination } from 'src/utilities/utils';
import { Book } from './book';
import { BookParser } from './book.parser';

@Injectable()
export class BookService implements IBookService {
  constructor(
    @Inject(TYPES.IApplicationLogger)
    private readonly _logger: IContextAwareLogger,
    @Inject(TYPES.IBookRepository)
    private readonly _bookRepository: IBookRepository,
    @Inject(TYPES.IRedisService)
    protected readonly _redisCacheService: IRedisService,
  ) {}

  async listBook(input: IListBookInpput): Promise<IFindBookResponse> {
    try {
      const { pageNum, pageSize, search } = input;

      const defaultPageSize = PAGINATION.defaultRecords;
      input.pageSize = pageSize ?? defaultPageSize;

      const cacheKey = `list_book_page${pageNum}_limit${pageSize}_searchBy${search}`;

      const cachedData = await this._getCachedData(cacheKey);

      if (cachedData && !input.search) {
        return cachedData;
      }

      const books: IListBooByPaginationResponse =
        await this._bookRepository.listBookByPagination(input);

      const parsedBook = BookParser.findBook(books.data);

      const paginatedBook: IFindBookResponse = pagination(
        parsedBook,
        input,
        books.total,
      ) as unknown as IFindBookResponse;

      await this._cacheResponse(paginatedBook, cacheKey);

      return paginatedBook;
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async findBook(input: IFindBookInput): Promise<IFindBookData[]> {
    try {
      const books: Book[] = await this._bookRepository.findBookByInput(input);

      if (books?.length === 0) {
        throw new NotFoundException(`Book not found`);
      }

      const foundBook: IFindBookData[] = BookParser.findBook(books);

      return foundBook;
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async getBookById(id: string): Promise<IFindBookData> {
    try {
      const book: Book = await this._bookRepository.findOne({
        where: { id },
      });

      if (!book) {
        throw new NotFoundException(`Book not found`);
      }

      const foundBook: IFindBookData = BookParser.updatedBook(book);

      return foundBook;
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async addManyBooks(
    inputs: IAddNewBookInput[],
    email: string,
  ): Promise<IAddBookResponse> {
    const success: IAddOneBookResponse[] = [];
    const failed: string[] = [];

    for (const input of inputs) {
      try {
        const result: IAddOneBookResponse = await this.addOneBook(input, email);
        success.push(result);
        await this.deleteBookPageCache();
      } catch (err) {
        failed.push(input.title);
      }
    }

    return { success, failed };
  }

  async addOneBook(
    input: IAddNewBookInput,
    email: string,
  ): Promise<IAddOneBookResponse> {
    try {
      const { title, author, barcodeNo, published_year, quantity, price } =
        input;

      const auditProps: IAudit = Audit.createAuditProperties(
        email,
        CRUD_ACTION.create,
      );
      const audit: Audit = Audit.create(auditProps).getValue();

      const newBook = Book.create({
        title,
        author,
        barcodeNo,
        published_year,
        quantity,
        price,
        audit,
      }).getValue();

      const savedBook = await this._bookRepository.save(newBook);

      if (!savedBook) {
        throw new BadRequestException(`Unable to add this ${title} book`);
      }

      return { message: 'Book added successfully' };
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async updateBook(
    id: string,
    input: IUpdateBook,
    email: string,
  ): Promise<IFindBookData> {
    try {
      const book: Book = await this._bookRepository.findOne({ where: { id } });

      if (!book) {
        throw new NotFoundException(`There is no book with ID ${id}`);
      }

      const auditProps: IAudit = Audit.createAuditProperties(
        email,
        CRUD_ACTION.update,
      );
      const audit: Audit = Audit.create(auditProps).getValue();

      const bookUpdate = Book.update(input, book, audit);

      const updatedBook: Book = await this._bookRepository.save(bookUpdate);

      if (!updatedBook) {
        throw new InternalServerErrorException(`Failed to update book`);
      }

      await this.deleteBookPageCache();

      return BookParser.updatedBook(updatedBook);
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async deleteBook(id: string, email: string): Promise<IDeleteBookResponse> {
    try {
      const book = await this._bookRepository.findOne({ where: { id } });

      if (!book) {
        throw new NotFoundException(`There is no book with ID ${id}`);
      }

      let updatedBook: Book;
      const updateAuditProps: IAudit = Audit.createAuditProperties(
        email,
        CRUD_ACTION.update,
      );
      const updateAudit: Audit = Audit.create(updateAuditProps).getValue();

      const deleteAuditProps: IAudit = Audit.createAuditProperties(
        email,
        CRUD_ACTION.delete,
      );
      const deleteAudit: Audit = Audit.create(deleteAuditProps).getValue();

      if (book.quantity > 1) {
        const updatedQuantity = book.quantity - 1;
        const bookUpdate = Book.update(
          { ...book, quantity: updatedQuantity },
          book,
          updateAudit,
        );
        updatedBook = await this._bookRepository.save(bookUpdate);
      } else {
        const bookUpdate = Book.update(
          { ...book, quantity: 0 },
          book,
          deleteAudit,
        );
        updatedBook = await this._bookRepository.save(bookUpdate);
      }

      if (!updatedBook) {
        throw new InternalServerErrorException(`Failed to delete book`);
      }

      await this.deleteBookPageCache();

      return { message: 'Book deleted successfully!' };
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

  async deleteBookPageCache(): Promise<void> {
    const keys = await this._redisCacheService.keys('*list_book_page*');
    if (keys.length > 0) {
      await this._redisCacheService.deleteMany(keys);
    }
  }
}
