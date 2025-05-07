import { IUserByID } from 'src/interface/service/user.service.interface';
import { User } from './user';

export class UserParser {
  static userById(user: User): IUserByID {
    const { id, email, role, status, name, matricOrStaffNo } = user;
    return {
      id,
      email,
      role,
      name,
      status,
      matricOrStaffNo,
    };
  }

  static listUser(users: User[]): IUserByID[] {
    const data = users.map((user: User) => {
      const { id, email, role, status, name, matricOrStaffNo } = user;
      return {
        id,
        email,
        role,
        name,
        status,
        matricOrStaffNo,
      };
    });
    return data;
  }
}
