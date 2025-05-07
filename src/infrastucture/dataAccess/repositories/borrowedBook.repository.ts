import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BOOK_STATUS, TYPES } from 'src/infrastucture/constant';
import { IContextAwareLogger } from 'src/infrastucture/logger';
import {
  IBorrowedBookRepository,
  IListBorrowedBookResponse,
} from 'src/interface/repositories/borrowedBook.repositories.interface';
import { IBorrowedBookListInput } from 'src/interface/service/borrowedBook.service.interface';
import { BorrowedBook } from 'src/modules/borrowedBook/borrowedBook';
import { BorrowedBookMapper } from 'src/modules/borrowedBook/borrowedBook.mapper';
import { LessThan, Repository } from 'typeorm';
import { BorrowedBookModel } from '../models/borrowedBook.entity';
import { GenericSqlRepository } from './generic.repository';

@Injectable()
export class BorrowedBookRepository
  extends GenericSqlRepository<BorrowedBook, BorrowedBookModel>
  implements IBorrowedBookRepository
{
  borrowedBookMapper: BorrowedBookMapper;
  constructor(
    @InjectRepository(BorrowedBookModel)
    repository: Repository<BorrowedBookModel>,
    borrowedBookMapper: BorrowedBookMapper,
    @Inject(TYPES.IApplicationLogger)
    private readonly _logger: IContextAwareLogger,
  ) {
    super(repository, borrowedBookMapper);
    this.borrowedBookMapper = borrowedBookMapper;
  }

  async getActiveBorrows(user_id: string): Promise<number> {
    try {
      return await this.repository.count({
        where: {
          user_id,
          status: BOOK_STATUS.BORROWED,
        },
      });
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async getOverdueBooks(user_id: string): Promise<BorrowedBook[]> {
    try {
      const overdueBooks: BorrowedBookModel[] = await this.repository.find({
        where: {
          user_id,
          status: BOOK_STATUS.BORROWED,
          return_date: LessThan(new Date().toISOString()),
        },
      });

      return overdueBooks.map((book) => this.borrowedBookMapper.toDomain(book));
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async getDuplicateBorrow(
    user_id: string,
    book_id: string,
  ): Promise<BorrowedBook> {
    try {
      const duplicateBorrow = await this.repository.findOne({
        where: {
          user_id,
          book_id,
          status: BOOK_STATUS.BORROWED,
        },
      });
      if (!duplicateBorrow) {
        return;
      }
      return this.borrowedBookMapper.toDomain(duplicateBorrow);
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async listBorrowedBookByPagination(
    input: IBorrowedBookListInput,
  ): Promise<IListBorrowedBookResponse> {
    try {
      const { pageNum, pageSize, search, studentId, statuses } = input;

      const skip = (pageNum - 1) * pageSize;
      const take = pageSize;

      const queryBuilder = this.repository
        .createQueryBuilder('borrow')
        .leftJoinAndSelect('borrow.user', 'user')
        .leftJoinAndSelect('borrow.book', 'book');

      if (search) {
        queryBuilder.andWhere(
          ` LOWER(user.name) LIKE :search
            OR LOWER(user.matricOrStaffNo) LIKE :search
            OR LOWER(user.role) LIKE :search
            OR LOWER(book.title) LIKE :search
            OR LOWER(book.author) LIKE :search`,
          { search: `%${search.toLowerCase()}%` },
        );
      }

      if (statuses && statuses.length > 0) {
        queryBuilder.andWhere('LOWER(borrow.status) IN (:...statuses)', {
          statuses: statuses.map((s) => s.toLowerCase()),
        });
      }

      if (studentId) {
        queryBuilder.andWhere(` LOWER(user.id) LIKE :studentId`, {
          studentId: `%${studentId}%`,
        });
      }

      const [records, total] = await queryBuilder
        .skip(skip)
        .take(take)
        .getManyAndCount();

      return {
        data: records.map((book: BorrowedBookModel) =>
          this.borrowedBookMapper.toDomain(book),
        ),
        total,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
