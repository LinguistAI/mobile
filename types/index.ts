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

export enum Sort {
  ASC = 'asc',
  DESC = 'desc',
}
