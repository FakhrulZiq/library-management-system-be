import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from 'src/infrastucture/constant';

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
