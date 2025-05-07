import { IFindBookData } from 'src/interface/service/Book.service.interface';
import { Book } from './Book';

export class BookParser {
  static findBook(books: Book[]): IFindBookData[] {
    const data = books.map((book: Book) => {
      return {
        id: book.id,
        bookTitle: book.title,
        bookAuthor: book.author,
        published_year: book.published_year,
        quantity: book.quantity,
        barcodeNo: book.barcodeNo,
        price: book.price,
      };
    });
    return data;
  }

  static updatedBook(book: Book): IFindBookData {
    const { id, title, author, published_year, quantity, price, barcodeNo } =
      book;
    return {
      id: id,
      bookTitle: title,
      bookAuthor: author,
      published_year,
      quantity,
      barcodeNo,
      price,
    };
  }
}
