import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Audit } from 'src/domain/audit/audit';
import { CRUD_ACTION, STATUS, TYPES } from 'src/infrastucture/constant';
import { IContextAwareLogger } from 'src/infrastucture/logger';
import { IAudit } from 'src/interface/audit.interface';
import { IUserRepository } from 'src/interface/repositories/user.repositories.interface';
import {
  IRegisterResponse,
  IResgisterInput,
  IUserByID,
  IUserService,
} from 'src/interface/service/user.service.interface';
import { User } from './user';
import { UserParser } from './user.parser';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(TYPES.IApplicationLogger)
    private readonly _logger: IContextAwareLogger,
    @Inject(TYPES.IUserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}

  async getUser(): Promise<IUserByID[]> {
    try {
      const user = await this._userRepository.findAll();
      return UserParser.listUser(user);
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
        throw new Error(`User with ID ${id} not found`);
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
        status: STATUS.ACTIVE,
        matricOrStaffNo,
        audit,
      }).getValue();

      const savedUser = await this._userRepository.save(newUser);

      if (!savedUser) {
        throw new BadRequestException(
          `Unable to create a new user with this ${email} email`,
        );
      }

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
}
