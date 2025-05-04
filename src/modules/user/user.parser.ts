import { IUserByID } from 'src/interface/service/user.service.interface';
import { User } from './user';

export class UserParser {
  static userById(user: User): IUserByID {
    const { email, role, name, matricOrStaffNo } = user;
    return {
      email,
      role,
      name,
      matricOrStaffNo,
    };
  }

  static listUser(users: User[]): IUserByID[] {
    const data = users.map((user: User) => {
      const { email, role, name, matricOrStaffNo } = user;
      return {
        email,
        role,
        name,
        matricOrStaffNo,
      };
    });
    return data;
  }
}
