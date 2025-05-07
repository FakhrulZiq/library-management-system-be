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
