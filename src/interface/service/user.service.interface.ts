import { User } from 'src/modules/user/user';

export interface IUserService {
  findById(id: string): Promise<IUserByID>;
  register(input: IResgisterInput): Promise<IRegisterResponse>;
  findByEmail(email: string): Promise<User>;
  clearRefreshToken(id: string): Promise<void>;
  getUser(input: IListUserInput): Promise<IFindUserResponse>;
  deleteUser(id: string, email: string): Promise<IDeleteResponse>;
}

export interface IResgisterInput {
  email: string;
  password: string;
  role: string;
  name: string;
  matricOrStaffNo: string;
}

interface IMessageResponse {
  message: string;
}

export interface IRegisterResponse extends IMessageResponse {}

export interface IDeleteResponse extends IMessageResponse {}

export interface IUserByID {
  id: string;
  email: string;
  role: string;
  name: string;
  status: string;
  matricOrStaffNo: string;
}

export interface IListUserInput {
  search?: string;
  pageNum?: number;
  pageSize?: number;
  roles?: string[];
}

export interface IFindUserResponse {
  data: IUserByID[];
  startRecord: number;
  endRecord: number;
  total?: number;
  pageSize?: number;
  totalPages?: number;
  nextPage?: number;
}
