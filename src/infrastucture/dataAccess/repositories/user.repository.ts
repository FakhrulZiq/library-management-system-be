import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserMapper } from 'src/modules/user/user.mapper';
import { User } from 'src/modules/user/user';
import { UserModel } from '../models/user.entity';
import { GenericSqlRepository } from './generic.repository';
import { IUserRepository } from 'src/interface/repositories/user.repositories.interface';

@Injectable()
export class UserRepository
  extends GenericSqlRepository<User, UserModel>
  implements IUserRepository
{
  constructor(
    @InjectRepository(UserModel)
    repository: Repository<UserModel>,
  ) {
    const userMapper = new UserMapper();
    super(repository, userMapper);
  }
}
