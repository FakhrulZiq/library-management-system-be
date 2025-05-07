import { ApiProperty } from '@nestjs/swagger';
import { FindBookData } from './bookInput.dto';

export class AddBookResponse {
  @ApiProperty()
  success: AddOneBookResponse[];

  @ApiProperty()
  failed: string[];
}

export class BookResponseMessage {
  @ApiProperty()
  message: string;
}

export class AddOneBookResponse extends BookResponseMessage {}

export class DeleteBookResponse extends BookResponseMessage {}

export class FindBookResponse {
  @ApiProperty()
  data: FindBookData[];

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