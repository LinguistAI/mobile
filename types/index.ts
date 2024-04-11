export interface StoredUserInfo {
  email: string;
  username: string;
  lastLogin: Date;
}

export interface StoredUserInfoWithTokens extends StoredUserInfo {
  accessToken: string;
  refreshToken: string;
}

export interface AccessToken {
  accessToken: string;
}

export interface APIResponse<T> {
  data?: T;
  msg: string;
  status: number;
  timestamp: Date;
}

type Sort = {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
};

type Pageable = {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
};

export interface Page<T> {
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
