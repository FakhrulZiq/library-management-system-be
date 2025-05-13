import { Injectable } from '@nestjs/common';
import { AuditMapper } from 'src/domain/audit/audit.mapper';
import { BookModel } from 'src/infrastucture/dataAccess/models/book.entity';
import { BorrowedBookModel } from 'src/infrastucture/dataAccess/models/borrowedBook.entity';
import { UserModel } from 'src/infrastucture/dataAccess/models/user.entity';
import { IMapper } from 'src/interface/mapper.interface';
import { Book } from '../book/book';
import { BookMapper } from '../book/book.mapper';
import { User } from '../user/user';
import { UserMapper } from '../user/user.mapper';
import { BorrowedBook } from './borrowedBook';

@Injectable()
export class BorrowedBookMapper
  implements IMapper<BorrowedBook, BorrowedBookModel>
{
  constructor(
    private readonly _userMapper: UserMapper,
    private readonly _bookMapper: BookMapper,
  ) {}
  toPersistence(entity: BorrowedBook): BorrowedBookModel {
    const {
      borrow_date,
      user_id,
      book_id,
      return_date,
      fine,
      due_date,
      status,
      user,
      book,
      audit,
    } = entity;

    const {
      auditCreatedBy,
      auditCreatedDateTime,
      auditDeletedBy,
      auditDeletedDateTime,
      auditModifiedBy,
      auditModifiedDateTime,
    } = audit;

    let userModel: UserModel;

    if (user) {
      userModel = this._userMapper.toPersistence(user);
    }

    let bookModel: BookModel;

    if (book) {
      bookModel = this._bookMapper.toPersistence(book);
    }

    const model: BorrowedBookModel = {
      id: entity.id,
      borrow_date,
      user_id,
      book_id,
      return_date,
      fine,
      due_date,
      status,
      user: userModel,
      book: bookModel,
      auditCreatedBy,
      auditCreatedDateTime,
      auditDeletedBy,
      auditDeletedDateTime,
      auditModifiedBy,
      auditModifiedDateTime,
    };
    return model;
  }

  toDomain(model: BorrowedBookModel): BorrowedBook {
    const {
      id,
      borrow_date,
      user_id,
      book_id,
      return_date,
      fine,
      due_date,
      status,
      user,
      book,
    } = model;

    let userDetail: User;

    if (user) {
      userDetail = this._userMapper.toDomain(user);
    }

    let bookDetail: Book;

    if (book) {
      bookDetail = this._bookMapper.toDomain(book);
    }

    return BorrowedBook.create(
      {
        borrow_date,
        user_id,
        book_id,
        return_date,
        fine,
        due_date,
        status,
        user: userDetail,
        book: bookDetail,
        audit: new AuditMapper().toDomain(model),
      },
      id,
    ).getValue();
  }
}
