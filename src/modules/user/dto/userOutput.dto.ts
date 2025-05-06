import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponse {
  @ApiProperty()
  message: string;
}

export class UserByIdResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  matricOrStaffNo: string;
}

export class FindUserResponse {
  @ApiProperty()
  data: UserByIdResponse[];

  @ApiProperty()
  startRecord: number;

  @ApiProperty()
  endRecord: number;

  @ApiProperty()
  total?: number;

  @ApiProperty()
  pageSize?: number;

  @ApiProperty()
  totalPages?: number;

  @ApiProperty()
  nextPage?: number;
}
