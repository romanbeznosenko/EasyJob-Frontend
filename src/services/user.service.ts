import type { User, UserEditRequest, UserDeleteRequest } from "../types/auth";
import type { ApiResponse } from "../types/general";
import { Api } from "../api/Api";

export const getUserDetails = async (): Promise<ApiResponse<User>> => {
  return Api.get("/api/user");
};

export const editUserDetails = async (payload: UserEditRequest): Promise<ApiResponse<void>> => {
  return Api.patch("/api/user", payload);
};

export const deleteUser = async (payload: UserDeleteRequest): Promise<ApiResponse<void>> => {
  return Api.delete("/api/user", { data: payload });
};
