export interface IBookService {
  addManyBooks(
    inputs: IAddNewBookInput[],
    email: string,
  ): Promise<IAddBookResponse>;
  findBook(input: IFindBookInput): Promise<IFindBookData[]>;
  updateBook(input: IUpdateBook, email: string): Promise<IFindBookData>;
  listBook(input: IListBookInpput): Promise<IFindBookResponse>;
  deleteBook(id: string, email: string): Promise<IDeleteBookResponse>;
}

export interface IUpdateBook {
  id: string;
  title: string;
  author: string;
  barcodeNo: string;
  published_year: string;
  quantity: number;
}

export interface IAddNewBookInput {
  title: string;
  author: string;
  barcodeNo: string;
  published_year: string;
  quantity: number;
}

export interface IAddBookResponse {
  success: IAddOneBookResponse[];
  failed: string[];
}

export interface IMessageResponse {
  message: string;
}

export interface IAddOneBookResponse extends IMessageResponse {}

export interface IDeleteBookResponse extends IMessageResponse {}

export interface IFindBookInput {
  title?: string;
  author?: string;
}

export interface IFindBookResponse {
  data: IFindBookData[]
  startRecord: number;
  endRecord: number;
  total?: number;
  pageSize?: number;
  totalPages?: number;
  nextPage?: number;
}

export interface IFindBookData {
  id: string;
  bookTitle: string;
  bookAuthor: string;
  published_year: string;
  quantity: number;
  barcodeNo: string;
}

export interface IListBookInpput {
  search?: string;
  pageNum?: number;
  pageSize?: number;
}