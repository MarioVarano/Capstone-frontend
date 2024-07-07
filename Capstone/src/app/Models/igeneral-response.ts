export interface IGeneralResponse<T> {
  data: T | null;
  errorMessage: string | null;
}
