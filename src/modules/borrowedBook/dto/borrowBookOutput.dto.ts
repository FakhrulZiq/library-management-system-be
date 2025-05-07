import { ApiProperty } from '@nestjs/swagger';
import { FindBookData } from 'src/modules/book/dto/bookInput.dto';

export class BorrowBookOutput {
  @ApiProperty()
  book: FindBookData;

  @ApiProperty()
  dueDate: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  remainingBookCanBorrow: number;
}

export class ReturnBookOutput {
  @ApiProperty()
  message: string;

  @ApiProperty()
  bookId: string;

  @ApiProperty()
  studentId: string;

  @ApiProperty()
  returnDate: string;
}

export class BorrowedListResponse {
  @ApiProperty()
  data: BorrowedBookData[];

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

export class BorrowedBookData {
  @ApiProperty()
  id: string;

  @ApiProperty()
  borrowDate: string;

  @ApiProperty()
  returnDate: string | null;

  @ApiProperty()
  dueDate: string | null;

  @ApiProperty()
  remainingDay: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  fine: number | null;

  @ApiProperty()
  user: BorrowedUser;

  @ApiProperty()
  book: BorrowBookData | null;
}

class BorrowedUser {
  @ApiProperty()
  name: string;

  @ApiProperty()
  matricOrStaffNo: string;
}

class BorrowBookData {
  @ApiProperty()
  title: string;

  @ApiProperty()
  author: string;

  @ApiProperty()
  price: number;
}
