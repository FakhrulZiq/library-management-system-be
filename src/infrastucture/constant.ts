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
  IBorrowedBookRepository: 'IBorrowedBookRepository',
  IBorrowedBookService: 'IBorrowedBookService',
  IRedisService: 'IRedisService',
};

export const ROLES_KEY = 'roles';

export const USER_ROLE = {
  STUDENT: 'student',
  LIBRARIAN: 'librarian',
};

export const USER_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  BANNED: 'Banned',
};

export const BOOK_STATUS = {
  BORROWED: 'Borrowed',
  RETURNED: 'Returned',
  LOSTED: 'Losted',
};

export const PAGINATION = {
  defaultRecords: 10,
};

export const DEFAULT_CACHE_TIME_TO_LIVE = 60 * 60 * 24;

export const MAX_BORROW_LIMIT = 5;
