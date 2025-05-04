import { User } from 'src/modules/user/user';

export interface IUserService {
  findById(id: string): Promise<IUserByID>;
  register(input: IResgisterInput): Promise<IRegisterResponse>;
  findByEmail(email: string): Promise<User>;
  clearRefreshToken(id: string): Promise<void>;
  getUser(): Promise<IUserByID[]>;
}

export interface IResgisterInput {
  email: string;
  password: string;
  role: string;
  name: string;
  matricOrStaffNo: string;
}

export interface IRegisterResponse {
  message: string;
}

export interface IUserByID {
  email: string;
  role: string;
  name: string;
  matricOrStaffNo: string;
}
