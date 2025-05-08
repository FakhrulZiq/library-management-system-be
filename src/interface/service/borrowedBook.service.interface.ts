import {
  IBorrowedBookDashboardResponse,
  ITrendingBook,
} from '../repositories/borrowedBook.repositories.interface';
import { IFindBookData } from './Book.service.interface';

export interface IBorrowedBookService {
  borrowBook(input: IBorrowBookInput, email: string): Promise<IBorrowBook>;
  returnBook(
    input: IReturnBookInput,
    email: string,
  ): Promise<IBorrowedBookData>;
  getAllBorrowedBook(
    input: IBorrowedBookListInput,
  ): Promise<IBorrowedBookListResponse>;
  getBorrowedBookById(id: string): Promise<IBorrowedBookData>;
  getBorrowBookByStudentId(
    input: IBorrowedBookListInput,
  ): Promise<IBorrowedBookListResponse>;
  dashboardCard(
    userId: string,
    role: string,
  ): Promise<IBorrowedBookDashboardResponse>;
  trendingBook(): Promise<ITrendingBook[]>;
  recentActivities(): Promise<IRecentActivityResponse[]>;
  recentActivitiesByStudent(userId: string): Promise<IRecentActivityResponse[]>;
  incomingDue(): Promise<IIncomingDueResponse[]>;
  incomingDueByStudent(userId: string): Promise<IIncomingDueResponse[]>;
}

export interface IBorrowBook {
  book: IFindBookData;
  dueDate: string;
  status: string;
  remainingBookCanBorrow: number;
}

export interface IDashboardCardInput {
  userId: string;
}

export interface IBorrowBookInput {
  studentId: string;
  bookId: string;
}

export interface IReturnBookInput {
  borrowedBookId: string;
  status: string;
  fine: number | null;
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
  studentId?: string;
  statuses?: string[];
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
  dueDate: string | null;
  fine: number | null;
  remainingDay: number;
  status: string;
  user: IBorrowedUser;
  book: IBorrowBookData | null;
}

export interface IRecentActivityResponse {
  id: string;
  borrowDate: string;
  title: string;
  author: string;
  borrowerName: string;
}

export interface IIncomingDueResponse {
  id: string;
  dueDate: string;
  title: string;
  author: string;
  borrowerName: string;
  remainingDay: number;
}

interface IBorrowedUser {
  name: string;
  matricOrStaffNo: string;
}

interface IBorrowBookData {
  title: string;
  author: string;
  price: number;
}
