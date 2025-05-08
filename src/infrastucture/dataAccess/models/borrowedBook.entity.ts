import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseModel } from './base.entity';
import { BookModel } from './book.entity';
import { UserModel } from './user.entity';

@Entity({ name: 'borrowed_book' })
export class BorrowedBookModel extends BaseModel {
  @Column()
  borrow_date: string;

  @Column()
  user_id: string;

  @Column()
  book_id: string;

  @Column({ nullable: true })
  return_date?: string;

  @Column({ nullable: true })
  fine?: number;

  @Column()
  due_date: string;

  @Column()
  status: string;

  @ManyToOne(() => UserModel, { nullable: true, cascade: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: UserModel;

  @ManyToOne(() => BookModel, { nullable: true, cascade: true })
  @JoinColumn({ name: 'book_id', referencedColumnName: 'id' })
  book?: BookModel;
}
