import { axiosBase } from "..";
import { APIResponse } from "../../types/common";

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
  const res = await axiosBase.post<APIResponse<RRegister>>(
    "/auth/changePassword",
    changePasswordDto
  );
  return res;
}

export async function resetPasswordRequest() {}

export async function resetPasswordConfirm() {}
