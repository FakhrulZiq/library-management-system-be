import { Column, Entity, OneToMany } from 'typeorm';

import { BaseModel } from './base.entity';
import { BorrowedBookModel } from './borrowedBook.entity';

@Entity({ name: 'users' })
export class UserModel extends BaseModel {
  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  matricOrStaffNo: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  role: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @OneToMany(
    () => BorrowedBookModel,
    (borrowedBook: BorrowedBookModel) => borrowedBook.user,
  )
  borrowedBooks?: BorrowedBookModel[];
}
