import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/modules/user/user.module';
import { DatabaseModule } from './infrastucture/dataAccess/database/database.module';
import { RedisCacheModule } from './infrastucture/redis/redisModule';
import { AuthModule } from './modules/auth/auth.module';
import { BookModule } from './modules/book/book.module';
import { BorrowedBookModule } from './modules/borrowedBook/borrowedBook.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    RedisCacheModule,
    UserModule,
    AuthModule,
    BookModule,
    BorrowedBookModule
  ],
})
export class AppModule {}
