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
import { CRUD_ACTION, TYPES } from 'src/infrastucture/constant';
import {
  IAuthService,
  ILogOutResponse,
  INewAccessToken,
  INewAccessTokenInput,
  IPayloadJwt,
  IResetPasswordInput,
  IResetPasswordResponse,
  IValidateUserInput,
  IValidateUserResponse,
} from 'src/interface/service/auth.service.interface';
import { IAudit } from 'src/interface/audit.interface';
import { Audit } from 'src/domain/audit/audit';

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
        expiresIn: '2h',
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
        name: user.name,
        id: user.id,
      };
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async verifyToken(accessToken: string): Promise<boolean> {
    try {
      const payload: IPayloadJwt = this._jwtService.verify(accessToken, {
        secret: this._configService.get<string>('JWT_SECRET'),
      });
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        this._logger.warn('', 'Token expired');
        return false;
      }

      return true;
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

      const inputNewToken = {
        email: user.email,
        sub: user.id,
        role: user.role,
      };
      const newAccessToken = this._jwtService.sign(inputNewToken, {
        expiresIn: '2m',
      });

      return { accessToken: newAccessToken };
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async resetPassword(
    input: IResetPasswordInput,
  ): Promise<IResetPasswordResponse> {
    try {
      const { email, password } = input;

      const user = await this._userRepository.findOne({ where: { email } });

      if (!user) {
        throw new NotFoundException(`There is no user with email ${email}`);
      }

      const hashedPassword: string = await bcrypt.hash(password, 10);

      const auditProps: IAudit = Audit.createAuditProperties(
        email,
        CRUD_ACTION.update,
      );
      const audit: Audit = Audit.create(auditProps).getValue();

      const passwordUpdate = User.update(
        { password: hashedPassword },
        user,
        audit,
      );

      const savedPassword = await this._userRepository.save(passwordUpdate);

      if (!savedPassword) {
        throw new Error('Update user password failed.');
      }

      return { message: 'Password reset sucessfully!' };
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
