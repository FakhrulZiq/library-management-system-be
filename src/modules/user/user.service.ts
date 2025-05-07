import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Audit } from 'src/domain/audit/audit';
import {
  CRUD_ACTION,
  DEFAULT_CACHE_TIME_TO_LIVE,
  PAGINATION,
  TYPES,
  USER_STATUS,
} from 'src/infrastucture/constant';
import { IContextAwareLogger } from 'src/infrastucture/logger';
import { IAudit } from 'src/interface/audit.interface';
import { IUserRepository } from 'src/interface/repositories/user.repositories.interface';
import {
  IDeleteResponse,
  IFindUserResponse,
  IListUserInput,
  IRegisterResponse,
  IResgisterInput,
  IUserByID,
  IUserService,
} from 'src/interface/service/user.service.interface';
import { User } from './user';
import { UserParser } from './user.parser';
import { IRedisService } from 'src/infrastucture/redis/redisInterface';
import { pagination } from 'src/utilities/utils';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(TYPES.IApplicationLogger)
    private readonly _logger: IContextAwareLogger,
    @Inject(TYPES.IUserRepository)
    private readonly _userRepository: IUserRepository,
    @Inject(TYPES.IRedisService)
    protected readonly _redisCacheService: IRedisService,
  ) {}

  async getUser(input: IListUserInput): Promise<IFindUserResponse> {
    try {
      const { pageNum, pageSize, search, roles } = input;

      const defaultPageSize = PAGINATION.defaultRecords;
      input.pageSize = pageSize ?? defaultPageSize;

      const cacheKey = `list_user_page${pageNum}_limit${pageSize}_searchBy${search}_role${roles}`;

      const cachedData = await this._getCachedData(cacheKey);

      if (cachedData && !input.search) {
        return cachedData;
      }
      const users = await this._userRepository.listBookByPagination(input);

      const parsedUser = UserParser.listUser(users.data);

      const paginatedBook: IFindUserResponse = pagination(
        parsedUser,
        input,
        users.total,
      ) as unknown as IFindUserResponse;

      await this._cacheResponse(paginatedBook, cacheKey);

      return paginatedBook;
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async findById(id: string): Promise<IUserByID> {
    try {
      const user: User = await this._userRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const userById: IUserByID = UserParser.userById(user);

      return userById;
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user: User = await this._userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new Error(`User with email ${email} not found`);
      }

      return user;
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async register(input: IResgisterInput): Promise<IRegisterResponse> {
    try {
      const { email, password, role, name, matricOrStaffNo } = input;

      const existingUser: User = await this._userRepository.findOne({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictException(
          `This email ${input.email} already registered`,
        );
      }

      const hashedPassword: string = await bcrypt.hash(password, 10);

      const auditProps: IAudit = Audit.createAuditProperties(
        input.email,
        CRUD_ACTION.create,
      );
      const audit: Audit = Audit.create(auditProps).getValue();

      const newUser = User.create({
        email,
        password: hashedPassword,
        role,
        name,
        status: USER_STATUS.ACTIVE,
        matricOrStaffNo,
        audit,
      }).getValue();

      const savedUser = await this._userRepository.save(newUser);

      if (!savedUser) {
        throw new BadRequestException(
          `Unable to create a new user with this ${email} email`,
        );
      }

      await this._deleteUserPageCache();

      return { message: 'User registration successfully' };
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async clearRefreshToken(id: string): Promise<void> {
    try {
      const user: User = await this._userRepository.findOne({
        where: { id },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      user.refreshToken = null;
      await this._userRepository.save(user);
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async deleteUser(id: string, email: string): Promise<IDeleteResponse> {
    try {
      const user = await this._userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const deleteAuditProps: IAudit = Audit.createAuditProperties(
        email,
        CRUD_ACTION.delete,
      );
      const deleteAudit: Audit = Audit.create(deleteAuditProps).getValue();

      const userDelete = User.update(user, user, deleteAudit);

      const saveDelete = await this._userRepository.save(userDelete);

      if (!saveDelete) {
        throw new InternalServerErrorException(`Failed to delete book`);
      }

      await this._deleteUserPageCache();

      return { message: 'User deleted successfully!' };
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  private async _getCachedData(cacheKey: string): Promise<any> {
    return (await this._redisCacheService.get(cacheKey)) as any;
  }

  private async _cacheResponse(data: any, cacheKey: string): Promise<void> {
    await this._redisCacheService.set(
      cacheKey,
      data,
      DEFAULT_CACHE_TIME_TO_LIVE,
    );
  }

  private async _deleteUserPageCache(): Promise<void> {
    const keys = await this._redisCacheService.keys('*list_user_page*');
    if (keys.length > 0) {
      await this._redisCacheService.deleteMany(keys);
    }
  }
}
