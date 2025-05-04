import { Audit } from 'src/domain/audit/audit';
import { Entity } from 'src/domain/entity';
import { Result } from 'src/domain/result';
import { IUser } from 'src/interface/user.interface';
import { updateEntity } from 'src/utilities/utils';

export class User extends Entity implements IUser {
  email: string;
  password: string;
  role: string;
  name: string;
  matricOrStaffNo: string;
  status: string;
  refreshToken?: string;
  audit: Audit;

  constructor(id: string, props: IUser) {
    super(id);
    this.email = props.email;
    this.password = props.password;
    this.name = props.name;
    this.matricOrStaffNo = props.matricOrStaffNo;
    this.status = props.status;
    this.role = props.role;
    this.refreshToken = props.refreshToken;
    this.audit = props.audit;
  }

  static create(props: IUser, id?: string): Result<User> {
    return Result.ok<User>(new User(id, props));
  }

  static update(props: Partial<IUser>, user: User, audit: Audit): User {
    return updateEntity(props, user, audit);
  }
}
