export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  personId: string;
  roles: Array<string>;
  error?: string;
};
