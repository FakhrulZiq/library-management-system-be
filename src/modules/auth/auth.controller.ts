import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { TYPES } from 'src/infrastucture/constant';
import {
  IAuthService,
  ILogOutResponse,
  INewAccessToken,
} from 'src/interface/service/auth.service.interface';
import { LoginInput, RefreshTokenInput } from './dto/auth-input.dto';
import { AuthResponse, LogOutResponse, NewAccessTokenResponse } from './dto/auth-response.dto';
import { JwtAuthGuard } from './auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

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

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Body() input: RefreshTokenInput): Promise<LogOutResponse> {
    return this._authService.logout(input);
  }
}
