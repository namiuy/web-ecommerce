import { Result } from '../types';
import { User } from '../entities';

// Tipos auxiliares para operaciones de usuario
export type UserAdd = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export type UserRestorePwd1 = {
  email: string;
};

export type UserRestorePwd2 = {
  token: string;
  password: string;
};

export type UserActivate = {
  token: string;
};

export type UserChangePwd = {
  old_password: string;
  new_password: string;
};

export type IUserRepository = {
  get: (id: string) => Promise<Result<User>>;
  add: (user: UserAdd) => Promise<Result<User>>;
  restorePwd1: (user: UserRestorePwd1) => Promise<Result<boolean>>;
  restorePwd2: (user: UserRestorePwd2) => Promise<Result<boolean>>;
  activate: (user: UserActivate) => Promise<Result<boolean>>;
  changePwd: (user: UserChangePwd) => Promise<Result<boolean>>;
};
