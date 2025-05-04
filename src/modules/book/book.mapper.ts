import { Injectable } from '@nestjs/common';
import { AuditMapper } from 'src/domain/audit/audit.mapper';
import { Book } from './Book';
import { BookModel } from 'src/infrastucture/dataAccess/models/Book.entity';
import { IMapper } from 'src/interface/mapper.interface';

@Injectable()
export class BookMapper implements IMapper<Book, BookModel> {
  toPersistence(entity: Book): BookModel {
    const { title, author, barcodeNo, published_year, quantity, audit } =
      entity;

    const {
      auditCreatedBy,
      auditCreatedDateTime,
      auditDeletedBy,
      auditDeletedDateTime,
      auditModifiedBy,
      auditModifiedDateTime,
    } = audit;

    const model: BookModel = {
      id: entity.id,
      title,
      author,
      barcodeNo,
      published_year,
      quantity,
      auditCreatedBy,
      auditCreatedDateTime,
      auditDeletedBy,
      auditDeletedDateTime,
      auditModifiedBy,
      auditModifiedDateTime,
    };
    return model;
  }

  toDomain(model: BookModel): Book {
    const { id, title, author, barcodeNo, published_year, quantity } = model;

    return Book.create(
      {
        title,
        author,
        barcodeNo,
        published_year,
        quantity,
        audit: new AuditMapper().toDomain(model),
      },
      id,
    ).getValue();
  }
}
