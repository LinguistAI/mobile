import { axiosBase, axiosSecure } from "..";
import { APIResponse } from "../../types/common";

export async function checkAuth() {
  const res = await axiosSecure.get<APIResponse<string>>("/auth/test");
  return res;
}

export async function login(loginDto: LoginDto) {
  const res = await axiosBase.post<APIResponse<RLogin>>(
    "/auth/login",
    loginDto
  );
  return res;
}

export async function register(registerDto: RegisterDto) {
  const res = await axiosBase.post<APIResponse<RRegister>>(
    "/auth/register",
    registerDto
  );
  return res;
}

export async function changePassword(changePasswordDto: ChangePasswordDto) {
  const res = await axiosSecure.put<APIResponse<string>>( // does not have any data in response so the type is redundant
    "/auth/change-password",
    changePasswordDto
  );
  return res;
}

export async function requestPasswordReset(
  requestPasswordResetDto: RequestPasswordResetDto
) {
  const res = await axiosBase.post<APIResponse<string>>( // does not have any data in response so the type is redundant
    "/auth/request-reset",
    requestPasswordResetDto
  );
  return res;
}

export async function requestPasswordCode(
  passwordResetCodeDto: PasswordResetCodeDto
) {
  const res = await axiosBase.post<APIResponse<string>>( // does not have any data in response so the type is redundant
    "/auth/validate-reset",
    passwordResetCodeDto
  );
  return res;
}

export async function saveResetPassword(
  passwordResetSaveDto: PasswordResetSaveDto
) {
  const res = await axiosBase.put<APIResponse<string>>( // does not have any data in response so the type is redundant
    "/auth/reset-password",
    passwordResetSaveDto
  );
  return res;
}
