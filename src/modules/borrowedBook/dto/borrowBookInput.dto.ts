import { ApiProperty } from '@nestjs/swagger';

export class BorrowBookInput {
  @ApiProperty()
  studentId: string;

  @ApiProperty()
  bookId: string;
}

export class ReturnBookInput {
  @ApiProperty()
  borrowedBookId: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  fine: number | null;
}

export class BorrowedBookListInput {
  @ApiProperty()
  search?: string;

  @ApiProperty()
  pageNum?: number;

  @ApiProperty()
  pageSize?: number;

  @ApiProperty()
  studentId?: string;

  @ApiProperty()
  filter?: string;
}
