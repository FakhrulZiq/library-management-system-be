import { Audit } from 'src/domain/audit/audit';

export interface IBook {
  title: string;
  author: string;
  barcodeNo: string;
  published_year: string;
  quantity: number;
  price: number;
  audit: Audit;
}
