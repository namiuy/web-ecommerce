export interface Response<T> {
  isLoading: boolean;
  data?: T;
  error?: Error;
}
