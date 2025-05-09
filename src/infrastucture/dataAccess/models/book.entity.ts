import { Column, Entity, OneToMany } from 'typeorm';
import { BaseModel } from './base.entity';
import { BorrowedBookModel } from './borrowedBook.entity';

@Entity({ name: 'book' })
export class BookModel extends BaseModel {
  @Column({ nullable: true })
  title: string;

  @Column()
  author: string;

  @Column()
  barcodeNo: string;

  @Column()
  published_year: string;

  @Column()
  isbn?: string;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @OneToMany(
    () => BorrowedBookModel,
    (borrowedBook: BorrowedBookModel) => borrowedBook.book,
  )
  borrowedBooks?: BorrowedBookModel[];
}
