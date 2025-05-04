import { Audit } from 'src/domain/audit/audit';
import { Entity } from 'src/domain/entity';
import { Result } from 'src/domain/result';
import { IBook } from 'src/interface/book.interface';
import { updateEntity } from 'src/utilities/utils';

export class Book extends Entity implements IBook {
  title: string;
  author: string;
  barcodeNo: string;
  published_year: string;
  quantity: number;
  audit: Audit;

  constructor(id: string, props: IBook) {
    super(id);
    this.title = props.title;
    this.author = props.author;
    this.barcodeNo = props.barcodeNo;
    this.published_year = props.published_year;
    this.quantity = props.quantity;
    this.audit = props.audit;
  }

  static create(props: IBook, id?: string): Result<Book> {
    return Result.ok<Book>(new Book(id, props));
  }

  static update(props: Partial<IBook>, book: Book, audit: Audit): Book {
    return updateEntity(props, book, audit);
  }
}
