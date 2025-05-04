import { BookModel } from 'src/infrastucture/dataAccess/models/Book.entity';
import { Book } from 'src/modules/Book/Book';
import { IGenericRepository } from '../genricRepository.interface';
import {
  IFindBookInput,
  IListBookInpput,
} from '../service/Book.service.interface';

export interface IBookRepository extends IGenericRepository<Book, BookModel> {
  findBookByInput(input: IFindBookInput): Promise<Book[]>;
  listBookByPagination(
    input: IListBookInpput,
  ): Promise<IListBooByPaginationResponse>;
}

export interface IListBooByPaginationResponse {
  data: Book[];
  total: number;
}
