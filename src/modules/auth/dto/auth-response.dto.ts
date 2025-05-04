import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;
}

export class NewAccessTokenDto {
  @ApiProperty()
  accessToken: string;
}

export class LogOutResponse {
  @ApiProperty()
  message: string;
}

export class NewAccessTokenResponse {
  @ApiProperty()
  accessToken: string;
}
