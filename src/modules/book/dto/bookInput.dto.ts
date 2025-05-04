import { ApiProperty } from '@nestjs/swagger';

export class AddNewBookInput {
  @ApiProperty()
  title: string;

  @ApiProperty()
  author: string;

  @ApiProperty()
  barcodeNo: string;

  @ApiProperty()
  published_year: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  email: string;
}

export class ListBookInput {
  @ApiProperty()
  search?: string;

  @ApiProperty()
  pageNum?: number;

  @ApiProperty()
  pageSize?: number;
}

export class FindBookInput {
  @ApiProperty()
  title?: string;

  @ApiProperty()
  author?: string;
}

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

export class FindBookData {
  @ApiProperty()
  id: string;

  @ApiProperty()
  bookTitle: string;

  @ApiProperty()
  bookAuthor: string;

  @ApiProperty()
  published_year: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  barcodeNo: string;
}

export class UpdateBookInput {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  author: string;

  @ApiProperty()
  barcodeNo: string;

  @ApiProperty()
  published_year: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  email: string;
}
