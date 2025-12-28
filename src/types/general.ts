export type ApiResponse<T = any> = {
  data?: T;
  message?: string;
  success?: boolean;
  errors?: Record<string, string[]>;
};

export type PaginatedResponse<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type ErrorResponse = {
  message: string;
  errors?: Record<string, string[]>;
};
