import { Audit } from 'src/domain/audit/audit';
import { Book } from 'src/modules/book/book';
import { User } from 'src/modules/user/user';

export interface IBorrowedBook {
  borrow_date: string;
  user_id: string;
  book_id: string;
  return_date?: string;
  fine?: number;
  due_date: string;
  status: string;
  user?: User;
  book?: Book;
  audit: Audit;
}
