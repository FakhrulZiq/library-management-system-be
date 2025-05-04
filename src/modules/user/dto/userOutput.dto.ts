import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponse {
  @ApiProperty()
  message: string;
}

export class UserByIdResponse {
  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  matricOrStaffNo: string;
}
