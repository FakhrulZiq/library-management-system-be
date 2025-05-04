import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user';
import { IUserService } from 'src/interface/service/user.service.interface';
import { IUserRepository } from 'src/interface/repositories/user.repositories.interface';
import { IContextAwareLogger } from 'src/infrastucture/logger';
import { TYPES } from 'src/infrastucture/constant';
import {
  IAuthService,
  ILogOutResponse,
  INewAccessToken,
  INewAccessTokenInput,
  IPayloadJwt,
  IValidateUserInput,
  IValidateUserResponse,
} from 'src/interface/service/auth.service.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(TYPES.IUserService)
    private readonly _userService: IUserService,
    @Inject(TYPES.IUserRepository)
    private readonly _userRepository: IUserRepository,
    private readonly _configService: ConfigService,
    private readonly _jwtService: JwtService,
    @Inject(TYPES.IApplicationLogger)
    private readonly _logger: IContextAwareLogger,
  ) {}

  async validateUser(
    input: IValidateUserInput,
  ): Promise<IValidateUserResponse> {
    try {
      const { email, password } = input;
      const user: User = await this._userService.findByEmail(email);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { email: user.email, sub: user.id, role: user.role };

      const accessToken = this._jwtService.sign(payload, {
        expiresIn: '30m',
      });

      const refreshToken = this._jwtService.sign(payload, {
        expiresIn: '1d',
        secret: this._configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      user.refreshToken = hashedRefreshToken;
      await this._userRepository.save(user);

      return {
        accessToken,
        refreshToken,
        email: user.email,
        role: user.role,
      };
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async assignNewAcessToken(
    input: INewAccessTokenInput,
  ): Promise<INewAccessToken> {
    try {
      const today: number = Date.now();
      const payload: IPayloadJwt = this._jwtService.verify(input.refreshToken, {
        secret: this._configService.get<string>('JWT_REFRESH_SECRET'),
      });
      const user = await this._userService.findByEmail(payload.email);

      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (today > payload.exp * 1000) {
        await this._userService.clearRefreshToken(user.email);

        throw new BadRequestException(
          'Your session has expired. Please log in again.',
        );
      }

      const newAccessToken = this._jwtService.sign({ sub: user.id });
      return { accessToken: newAccessToken };
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async logout(input: INewAccessTokenInput): Promise<ILogOutResponse> {
    try {
      const payload = this._jwtService.verify(input.refreshToken, {
        secret: this._configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this._userService.findByEmail(payload.email);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!user.refreshToken) {
        throw new BadRequestException(
          'User already logged out, Please login again!',
        );
      }
      const isValid = await bcrypt.compare(
        input.refreshToken,
        user.refreshToken,
      );

      if (!isValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      user.refreshToken = null;
      await this._userRepository.save(user);

      return { message: 'User log out successfully' };
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }
}
