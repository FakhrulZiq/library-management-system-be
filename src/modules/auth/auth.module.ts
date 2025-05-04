import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMapper } from '../user/user.mapper';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.stratergy';
import { UserModel } from 'src/infrastucture/dataAccess/models/user.entity';
import { TYPES } from 'src/infrastucture/constant';
import { UserRepository } from 'src/infrastucture/dataAccess/repositories/user.repository';
import { ApplicationLogger } from 'src/infrastucture/logger';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserModel]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '30m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: TYPES.IAuthService,
      useClass: AuthService,
    },
    {
      provide: TYPES.IUserService,
      useClass: UserService,
    },
    {
      provide: TYPES.IUserRepository,
      useClass: UserRepository,
    },
    { provide: TYPES.IApplicationLogger, useClass: ApplicationLogger },
    UserMapper,
    JwtStrategy,
  ],
})
export class AuthModule {}
