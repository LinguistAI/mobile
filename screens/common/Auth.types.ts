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
