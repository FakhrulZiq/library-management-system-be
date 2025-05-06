import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TYPES } from 'src/infrastucture/constant';
import { UserModel } from 'src/infrastucture/dataAccess/models/user.entity';
import { UserRepository } from 'src/infrastucture/dataAccess/repositories/user.repository';
import { ApplicationLogger } from 'src/infrastucture/logger';
import { UserController } from './user.controller';
import { UserMapper } from './user.mapper';
import { UserService } from './user.service';
import { RedisCacheService } from 'src/infrastucture/redis/redisService';
import { RedisClientProvider } from 'src/infrastucture/redis/redis.provider';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  controllers: [UserController],
  providers: [
    {
      provide: TYPES.IUserService,
      useClass: UserService,
    },
    {
      provide: TYPES.IUserRepository,
      useClass: UserRepository,
    },
    { provide: TYPES.IApplicationLogger, useClass: ApplicationLogger },
    { provide: TYPES.IRedisService, useClass: RedisCacheService },
    RedisClientProvider,
    UserMapper,
  ],
})
export class UserModule {}
