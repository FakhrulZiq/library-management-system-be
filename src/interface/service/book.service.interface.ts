export interface IBookService {
  addManyBooks(
    inputs: IAddNewBookInput[],
    email: string,
  ): Promise<IAddBookResponse>;
  findBook(input: IFindBookInput): Promise<IFindBookData[]>;
  updateBook(id: string, input: IUpdateBook, email: string): Promise<IFindBookData>;
  listBook(input: IListBookInpput): Promise<IFindBookResponse>;
  deleteBook(id: string, email: string): Promise<IDeleteBookResponse>;
  deleteBookPageCache(): Promise<void>;
  getBookById(id: string): Promise<IFindBookData>;
}

export interface IUpdateBook {
  title: string;
  author: string;
  barcodeNo: string;
  published_year: string;
  quantity: number;
  price: number;
}

export interface IAddNewBookInput {
  title: string;
  author: string;
  barcodeNo: string;
  published_year: string;
  quantity: number;
  price: number;
}

export interface IAddBookResponse {
  success: IAddOneBookResponse[];
  failed: string[];
}

interface IMessageResponse {
  message: string;
}

export interface IAddOneBookResponse extends IMessageResponse {}

export interface IDeleteBookResponse extends IMessageResponse {}

export interface IFindBookInput {
  title?: string;
  author?: string;
}

export interface IFindBookResponse {
  data: IFindBookData[];
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
  price: number;
}

export interface IListBookInpput {
  search?: string;
  pageNum?: number;
  pageSize?: number;
}
