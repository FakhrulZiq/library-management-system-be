import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from '../models/user.entity';
import { BookModel } from '../models/book.entity';
import { BorrowedBookModel } from '../models/borrowedBook.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.getOrThrow('MYSQL_HOST'),
        port: config.getOrThrow('MYSQL_PORT'),
        database: config.getOrThrow('MYSQL_NAME'),
        username: config.getOrThrow('MYSQL_USERNAME'),
        password: config.getOrThrow('MYSQL_PASSWORD'),
        entities: [UserModel, BookModel, BorrowedBookModel],
        autoLoadEntities: false,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
