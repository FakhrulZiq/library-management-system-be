import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TYPES } from 'src/infrastucture/constant';
import { BookModel } from 'src/infrastucture/dataAccess/models/book.entity';
import { BookRepository } from 'src/infrastucture/dataAccess/repositories/book.repository';
import { ApplicationLogger } from 'src/infrastucture/logger';
import { BookController } from './book.controller';
import { BookMapper } from './book.mapper';
import { BookService } from './book.service';
import { RedisCacheService } from 'src/infrastucture/redis/redisService';

@Module({
  imports: [TypeOrmModule.forFeature([BookModel])],
  controllers: [BookController],
  providers: [
    {
      provide: TYPES.IBookService,
      useClass: BookService,
    },
    {
      provide: TYPES.IBookRepository,
      useClass: BookRepository,
    },
    { provide: TYPES.IApplicationLogger, useClass: ApplicationLogger },
    { provide: TYPES.RedisCacheService, useClass: RedisCacheService },
    BookMapper,
  ],
})
export class BookModule {}
