import { BorrowedBookModel } from 'src/infrastucture/dataAccess/models/borrowedBook.entity';
import { BorrowedBook } from 'src/modules/borrowedBook/borrowedBook';
import { IGenericRepository } from '../genricRepository.interface';
import { IBorrowedBookListInput } from '../service/borrowedBook.service.interface';

export interface IBorrowedBookRepository
  extends IGenericRepository<BorrowedBook, BorrowedBookModel> {
  getActiveBorrows(user_id: string): Promise<number>;
  getOverdueBooks(user_id: string): Promise<BorrowedBook[]>;
  getDuplicateBorrow(user_id: string, book_id: string): Promise<BorrowedBook>;
  listBorrowedBookByPagination(
    input: IBorrowedBookListInput,
  ): Promise<IListBorrowedBookResponse>;
  borrowedBookDashboard(): Promise<IBorrowedBookDashboard>;
  studentBorrowedBookDashboard(userId: string): Promise<IBorrowedBookDashboard>;
  getTrendingBooks(): Promise<ITrendingBook[]>;
  getRecentActivity(): Promise<BorrowedBook[]>;
  getRecentActivityByStudent(user_id: string): Promise<BorrowedBook[]>;
  getIncomingDueByStudent(user_id: string): Promise<BorrowedBook[]>;
  getIncomingDue(): Promise<BorrowedBook[]>;
}

export interface IListBorrowedBookResponse {
  data: BorrowedBook[];
  total: number;
}

export interface IBorrowedBookDashboard {
  borrowedCount: number;
  lostedCount: number;
  totalFine: number;
}

export interface IBorrowedBookDashboardResponse extends IBorrowedBookDashboard {
  totalAvailableBook: number;
}

export interface ITrendingBook {
  id: string;
  title: string;
  author: string;
  borrowCount: number;
}
