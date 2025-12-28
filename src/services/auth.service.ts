import type { LoginPayload, RegisterPayload, ChangePassword, User } from "../types/auth";
import type { ApiResponse } from "../types/general";
import { Api } from "../api/Api";

export const getCsrfRequest = () => {
  return Api.get("/csrf");
};

export const loginRequest = async (payload: LoginPayload): Promise<ApiResponse<User>> => {
  console.log("Sending login request to:", Api.defaults.baseURL);
  // Try CSRF request first, but don't fail if it returns 401
  try {
    await getCsrfRequest();
  } catch (error) {
    console.log("CSRF request failed, continuing with login...");
  }

  // Login endpoint returns CustomResponse with null data
  // We need to fetch user details after successful login
  await Api.post("/auth/login", payload, { withCredentials: true });

  // Renew CSRF token after successful login
  try {
    await getCsrfRequest();
  } catch (error) {
    console.log("Failed to renew CSRF token after login:", error);
  }

  // After successful login, fetch the user details
  return getCurrentUserRequest();
};

export const registerRequest = async (payload: RegisterPayload): Promise<ApiResponse<User>> => {
  // Try CSRF request first, but don't fail if it returns 401
  try {
    await getCsrfRequest();
  } catch (error) {
    console.log("CSRF request failed, continuing with registration...");
  }

  return Api.post("/auth/register", payload, { withCredentials: true });
};

export const logoutRequest = (): Promise<ApiResponse> => {
  return Api.post("/auth/logout");
};

export const changePassword = async (payload: ChangePassword): Promise<ApiResponse> => {
  console.log("Starting changePassword");

  const response: ApiResponse = await Api.post("/auth/reset-password", payload, {
    withCredentials: true,
    validateStatus: () => true,
  });

  console.log("Response: ", response);

  return response;
};

export const getCurrentUserRequest = async (): Promise<ApiResponse<User>> => {
  return Api.get("/api/user");
};
