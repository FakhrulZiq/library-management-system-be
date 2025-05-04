import { ApiProperty } from '@nestjs/swagger';

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
