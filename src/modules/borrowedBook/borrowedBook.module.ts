import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TYPES } from 'src/infrastucture/constant';
import { BookModel } from 'src/infrastucture/dataAccess/models/book.entity';
import { BorrowedBookModel } from 'src/infrastucture/dataAccess/models/borrowedBook.entity';
import { BookRepository } from 'src/infrastucture/dataAccess/repositories/book.repository';
import { BorrowedBookRepository } from 'src/infrastucture/dataAccess/repositories/borrowedBook.repository';
import { ApplicationLogger } from 'src/infrastucture/logger';
import { BorrowedBookController } from './borrowedBook.controller';
import { BorrowedBookMapper } from './borrowedBook.mapper';
import { BorrowedBookService } from './borrowedBook.service';
import { UserMapper } from '../user/user.mapper';
import { BookMapper } from '../Book/Book.mapper';
import { RedisCacheService } from 'src/infrastucture/redis/redisService';
import { BookService } from '../book/book.service';

@Module({
  imports: [TypeOrmModule.forFeature([BorrowedBookModel, BookModel])],
  controllers: [BorrowedBookController],
  providers: [
    {
      provide: TYPES.IBorrowedBookService,
      useClass: BorrowedBookService,
    },
    {
      provide: TYPES.IBookService,
      useClass: BookService,
    },
    {
      provide: TYPES.IBorrowedBookRepository,
      useClass: BorrowedBookRepository,
    },
    {
      provide: TYPES.IBookRepository,
      useClass: BookRepository,
    },
    { provide: TYPES.IApplicationLogger, useClass: ApplicationLogger },
    { provide: TYPES.IRedisService, useClass: RedisCacheService },
    BorrowedBookMapper,
    UserMapper,
    BookMapper,
  ],
})
export class BorrowedBookModule {}
