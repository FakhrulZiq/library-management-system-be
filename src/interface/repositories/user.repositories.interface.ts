import { UserModel } from "src/infrastucture/dataAccess/models/user.entity";
import { User } from "src/modules/user/user";
import { IGenericRepository } from "../genricRepository.interface";

export interface IUserRepository extends IGenericRepository<User, UserModel> {}
