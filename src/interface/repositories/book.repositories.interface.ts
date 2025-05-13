import { BookModel } from 'src/infrastucture/dataAccess/models/book.entity';
import { Book } from 'src/modules/book/book';
import { IGenericRepository } from '../genricRepository.interface';
import {
  IFindBookInput,
  IListBookInpput,
} from '../service/book.service.interface';

export interface IBookRepository extends IGenericRepository<Book, BookModel> {
  findBookByInput(input: IFindBookInput): Promise<Book[]>;
  listBookByPagination(
    input: IListBookInpput,
  ): Promise<IListBooByPaginationResponse>;
  totalAvailableBook(): Promise<number>;
}

export interface IListBooByPaginationResponse {
  data: Book[];
  total: number;
}
