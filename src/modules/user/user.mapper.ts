import { Injectable } from '@nestjs/common';
import { AuditMapper } from 'src/domain/audit/audit.mapper';
import { User } from './user';
import { UserModel } from 'src/infrastucture/dataAccess/models/user.entity';
import { IMapper } from 'src/interface/mapper.interface';

@Injectable()
export class UserMapper implements IMapper<User, UserModel> {
  toPersistence(entity: User): UserModel {
    const {
      email,
      password,
      role,
      name,
      matricOrStaffNo,
      status,
      refreshToken,
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

    const model: UserModel = {
      id: entity.id,
      email,
      password,
      role,
      name,
      matricOrStaffNo,
      status,
      refreshToken,
      auditCreatedBy,
      auditCreatedDateTime,
      auditDeletedBy,
      auditDeletedDateTime,
      auditModifiedBy,
      auditModifiedDateTime,
    };
    return model;
  }

  toDomain(model: UserModel): User {
    const {
      email,
      password,
      id,
      refreshToken,
      role,
      name,
      status,
      matricOrStaffNo,
    } = model;

    return User.create(
      {
        email,
        password,
        role,
        name,
        status,
        matricOrStaffNo,
        refreshToken,
        audit: new AuditMapper().toDomain(model),
      },
      id,
    ).getValue();
  }
}
