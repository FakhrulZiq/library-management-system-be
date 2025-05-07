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
}

export interface IListBorrowedBookResponse {
  data: BorrowedBook[];
  total: number;
}
