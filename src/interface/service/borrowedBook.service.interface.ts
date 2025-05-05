import { IFindBookData } from './Book.service.interface';

export interface IBorrowedBookService {
  borrowBook(input: IBorrowBookInput, email: string): Promise<IBorrowBook>;
  returnBook(
    input: IReturnBookInput,
    email: string,
  ): Promise<IReturnBookOutput>;
  getAllBorrowedBook(
    input: IBorrowedBookListInput,
  ): Promise<IBorrowedBookListResponse>;
  getBorrowedBookById(id: string): Promise<IBorrowedBookData>;
}

export interface IBorrowBook {
  book: IFindBookData;
  dueDate: string;
  status: string;
  remainingBookCanBorrow: number;
}

export interface IBorrowBookInput {
  studentId: string;
  bookId: string;
}

export interface IReturnBookInput {
  borrowedBookId: string;
}

export interface IReturnBookOutput {
  message: string;
  bookId: string;
  studentId: string;
  returnDate: string;
}

export interface IBorrowedBookListInput {
  search?: string;
  pageNum?: number;
  pageSize?: number;
}

export interface IBorrowedBookListResponse {
  data: IBorrowedBookData[];
  startRecord: number;
  endRecord: number;
  total?: number;
  pageSize?: number;
  totalPages?: number;
  nextPage?: number;
}

export interface IBorrowedBookData {
  id: string;
  borrowDate: string;
  returnDate: string | null;
  status: string;
  user: IBorrowedUser;
  book: IBorrowBookData | null;
}

interface IBorrowedUser {
  name: string;
  matricOrStaffNo: string;
}

interface IBorrowBookData {
  title: string;
  author: string;
}