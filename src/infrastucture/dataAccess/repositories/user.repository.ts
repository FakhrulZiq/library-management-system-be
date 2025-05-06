import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserMapper } from 'src/modules/user/user.mapper';
import { User } from 'src/modules/user/user';
import { UserModel } from '../models/user.entity';
import { GenericSqlRepository } from './generic.repository';
import {
  IListUserByPaginationResponse,
  IUserRepository,
} from 'src/interface/repositories/user.repositories.interface';
import { IListUserInput } from 'src/interface/service/user.service.interface';

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

  async listBookByPagination(
    input: IListUserInput,
  ): Promise<IListUserByPaginationResponse> {
    try {
      const { pageNum, pageSize, search, roles } = input;

      const skip = (pageNum - 1) * pageSize;
      const take = pageSize;

      const queryBuilder = this.repository.createQueryBuilder('user');

      if (search) {
        queryBuilder.andWhere(
          'LOWER(user.name) LIKE :search OR LOWER(user.matricOrStaffNo) LIKE :search',
          { search: `%${search.toLowerCase()}%` },
        );
      }

      if (roles) {
        queryBuilder.andWhere('LOWER(user.role) IN (:...roles)', {
          roles: roles.map((r) => r.toLowerCase()),
        });
      }

      const [users, total] = await queryBuilder
        .skip(skip)
        .take(take)
        .getManyAndCount();

      return {
        data: users.map((book: UserModel) => this.mapper.toDomain(book)),
        total,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
