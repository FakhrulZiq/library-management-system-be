import {
  Body,
  Controller,
  Inject,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TYPES } from 'src/infrastucture/constant';
import { IAuthService } from 'src/interface/service/auth.service.interface';
import { JwtAuthGuard } from './auth.guard';
import { LoginInput, RefreshTokenInput } from './dto/auth-input.dto';
import {
  AuthResponse,
  LogOutResponse,
  NewAccessTokenResponse,
} from './dto/auth-response.dto';

@ApiTags('User')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(TYPES.IAuthService)
    private readonly _authService: IAuthService,
  ) {}

  @Post('login')
  async login(@Body() loginInput: LoginInput): Promise<AuthResponse> {
    return this._authService.validateUser(loginInput);
  }

  @Post('refresh-token')
  async refreshToken(
    @Body() input: RefreshTokenInput,
  ): Promise<NewAccessTokenResponse> {
    return this._authService.assignNewAcessToken(input);
  }

  @Post('verify')
  async verifyToken(@Req() req) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Unauthorized');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      const isValid = await this._authService.verifyToken(token);
      return { valid: isValid };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Body() input: RefreshTokenInput): Promise<LogOutResponse> {
    return this._authService.logout(input);
  }
}
