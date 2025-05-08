export interface IAuthService {
  validateUser(input: IValidateUserInput): Promise<IValidateUserResponse>;
  assignNewAcessToken(input: INewAccessTokenInput): Promise<INewAccessToken>;
  logout(input: INewAccessTokenInput): Promise<ILogOutResponse>;
  verifyToken(accessToken: string): Promise<boolean>;
  resetPassword(input: IResetPasswordInput): Promise<IResetPasswordResponse>;
}

export interface IValidateUserInput {
  email: string;
  password: string;
}

export interface IResetPasswordInput extends IValidateUserInput {}

export interface IValidateUserResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  role: string;
  name: string;
  id: string;
}

export interface INewAccessTokenInput {
  refreshToken: string;
}

export interface INewAccessToken {
  accessToken: string;
}

export interface IPayloadJwt {
  exp: number;
  iat: number;
  email: string;
  sub: string;
}

export interface ILogOutResponse {
  message: string;
}

export interface IResetPasswordResponse extends ILogOutResponse {}
