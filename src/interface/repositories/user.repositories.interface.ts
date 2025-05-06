import { UserModel } from "src/infrastucture/dataAccess/models/user.entity";
import { User } from "src/modules/user/user";
import { IGenericRepository } from "../genricRepository.interface";
import { IListUserInput } from "../service/user.service.interface";

export interface IUserRepository extends IGenericRepository<User, UserModel> {
  listBookByPagination(
    input: IListUserInput,
  ): Promise<IListUserByPaginationResponse>;
}

export interface IListUserByPaginationResponse {
  data: User[];
  total: number;
}
