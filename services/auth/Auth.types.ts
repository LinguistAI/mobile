import { StoredUserInfoWithTokens } from '../../types';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface RRegister extends StoredUserInfoWithTokens {}

export interface RLogin {
  username: string;
  email: string;
  id: string;
  accessToken: string;
  refreshToken: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export type RequestPasswordResetDto = {
  email: string;
};

export type PasswordResetCodeDto = {
  email: string;
  resetCode: string;
};

type PasswordResetSaveDto = {
  email: string;
  newPassword: string;
  resetCode: string;
};
