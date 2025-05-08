import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterInput {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @ApiProperty()
  role: string;

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  matricOrStaffNo: string;
}

export class UpdateUserInput {
  @ApiProperty()
  name: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  matricOrStaffNo: string;

  @ApiProperty()
  status: string;
}

export class ChangeUserPasswordInput {
  @ApiProperty()
  oldPassword: string;

  @ApiProperty()
  newPassword: string;
}

export class ListUserInput {
  @ApiProperty()
  search?: string;

  @ApiProperty()
  pageNum?: number;

  @ApiProperty()
  pageSize?: number;

  @ApiProperty()
  roles?: string[];
}
