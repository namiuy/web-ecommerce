export type Result<T> = {
  isLoading: boolean;
  data?: T;
  error?: string;
};
