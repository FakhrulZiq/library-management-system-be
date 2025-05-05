import { Audit } from 'src/domain/audit/audit';
import { Entity } from 'src/domain/entity';
import { Result } from 'src/domain/result';
import { IBook } from 'src/interface/book.interface';
import { IBorrowedBook } from 'src/interface/borrowedBook.interface';
import { updateEntity } from 'src/utilities/utils';
import { User } from '../user/user';
import { Book } from '../Book/Book';

export class BorrowedBook extends Entity implements IBorrowedBook {
  borrow_date: string;
  user_id: string;
  book_id: string;
  return_date?: string;
  due_date: string;
  status: string;
  user?: User;
  book?: Book;
  audit: Audit;

  constructor(id: string, props: IBorrowedBook) {
    super(id);
    this.borrow_date = props.borrow_date;
    this.user_id = props.user_id;
    this.book_id = props.book_id;
    this.return_date = props.return_date;
    this.due_date = props.due_date;
    this.status = props.status;
    this.user = props.user;
    this.book = props.book;
    this.audit = props.audit;
  }

  static create(props: IBorrowedBook, id?: string): Result<BorrowedBook> {
    return Result.ok<BorrowedBook>(new BorrowedBook(id, props));
  }

  static update(
    props: Partial<IBorrowedBook>,
    borrowedBook: BorrowedBook,
    audit: Audit,
  ): BorrowedBook {
    return updateEntity(props, borrowedBook, audit);
  }
}
