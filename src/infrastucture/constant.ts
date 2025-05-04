export const CRUD_ACTION = {
  create: 'create',
  retrieve: 'retrieve',
  update: 'update',
  delete: 'delete',
};

export const TYPES = {
  IApplicationLogger: 'IApplicationLogger',
  IUserRepository: 'IUserRepository',
  IUserService: 'IUserService',
  IAuthService: 'IAuthService',
  IBookRepository: 'IBookRepository',
  IBookService: 'IBookService',
  RedisCacheService: 'RedisCacheService',
};

export const ROLES_KEY = 'roles';

export const STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  BANNED: 'Banned',
};

export const PAGINATION = {
  defaultRecords: 10,
};

export const DEFAULT_CACHE_TIME_TO_LIVE = 60 * 60 * 24;
