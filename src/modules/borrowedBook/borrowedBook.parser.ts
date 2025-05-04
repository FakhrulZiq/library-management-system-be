import { extractDateFromISOString } from 'src/utilities/utils';
import { BorrowedBook } from './borrowedBook';
import { IBorrowedBookData } from 'src/interface/service/borrowedBook.service.interface';

export class BorrowedBookParser {
  static listBook(borrowedBooks: BorrowedBook[]): IBorrowedBookData[] {
    const data = borrowedBooks.map((borrowedBook: BorrowedBook) => {
      return {
        id: borrowedBook.id,
        borrowDate: extractDateFromISOString(borrowedBook?.borrow_date),
        returnDate: extractDateFromISOString(borrowedBook?.return_date),
        status: borrowedBook.status,
        user: borrowedBook.user
          ? {
              name: borrowedBook.user.name,
              matricOrStaffNo: borrowedBook.user.matricOrStaffNo,
            }
          : null,
        book: borrowedBook.book
          ? {
              title: borrowedBook.book.title,
              author: borrowedBook.book.author,
            }
          : null,
      };
    });
    return data;
  }

  static bookById(borrowedBook: BorrowedBook): IBorrowedBookData {
    return {
       id: borrowedBook.id,
        borrowDate: extractDateFromISOString(borrowedBook?.borrow_date),
        returnDate: extractDateFromISOString(borrowedBook?.return_date),
        status: borrowedBook.status,
        user: borrowedBook.user
          ? {
              name: borrowedBook.user.name,
              matricOrStaffNo: borrowedBook.user.matricOrStaffNo,
            }
          : null,
        book: borrowedBook.book
          ? {
              title: borrowedBook.book.title,
              author: borrowedBook.book.author,
            }
          : null,
    }
  }
}
