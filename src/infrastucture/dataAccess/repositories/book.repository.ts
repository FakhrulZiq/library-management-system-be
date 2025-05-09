import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IBookRepository,
  IListBooByPaginationResponse,
} from 'src/interface/repositories/book.repositories.interface';
import { Book } from 'src/modules/Book/Book';
import { BookMapper } from 'src/modules/Book/Book.mapper';
import { ILike, Repository } from 'typeorm';
import { BookModel } from '../models/Book.entity';
import { GenericSqlRepository } from './generic.repository';
import {
  IFindBookInput,
  IListBookInpput,
} from 'src/interface/service/Book.service.interface';

@Injectable()
export class BookRepository
  extends GenericSqlRepository<Book, BookModel>
  implements IBookRepository
{
  private readonly bookMapper: BookMapper;

  constructor(
    @InjectRepository(BookModel)
    repository: Repository<BookModel>,
  ) {
    const bookMapper = new BookMapper();
    super(repository, bookMapper);
    this.bookMapper = bookMapper;
  }

  async findBookByInput(input: IFindBookInput): Promise<Book[]> {
    try {
      const books: BookModel[] = await this.repository.find({
        where: [
          { title: ILike(`%${input.title}%`) },
          { author: ILike(`%${input.author}%`) },
        ],
      });
      return books.map((book: BookModel) => this.bookMapper.toDomain(book));
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async listBookByPagination(
    input: IListBookInpput,
  ): Promise<IListBooByPaginationResponse> {
    try {
      const { pageNum, pageSize, search } = input;

      const skip = (pageNum - 1) * pageSize;
      const take = pageSize;

      const queryBuilder = this.repository.createQueryBuilder('book');

      if (search) {
        queryBuilder.where(
          'LOWER(book.title) LIKE :search OR LOWER(book.author) LIKE :search',
          { search: `%${search.toLowerCase()}%` },
        );
        queryBuilder.andWhere('book.quantity > 0');
      } else {
        queryBuilder.where('book.quantity > 0');
      }

      const [books, total] = await queryBuilder
        .skip(skip)
        .take(take)
        .getManyAndCount();

      return {
        data: books.map((book: BookModel) => this.bookMapper.toDomain(book)),
        total,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async totalAvailableBook(): Promise<number> {
    try {
      const result = await this.repository
        .createQueryBuilder('book')
        .select('SUM(book.quantity)', 'total')
        .getRawOne();

      return parseInt(result.total, 10) || 0;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
