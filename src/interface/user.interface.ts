import { Audit } from 'src/domain/audit/audit';

export interface IUser {
  email: string;
  password: string;
  name: string;
  matricOrStaffNo: string;
  role: string;
  refreshToken?: string;
  status: string;
  audit: Audit;
}
