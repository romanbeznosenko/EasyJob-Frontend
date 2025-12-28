import type { AccountActivationRequest, VerificationCodeResendRequest } from "../types/accountActivation";
import type { ApiResponse } from "../types/general";
import { Api } from "../api/Api";

export const activateAccountRequest = async (payload: AccountActivationRequest): Promise<ApiResponse<string>> => {
  return Api.post("/auth/activate", payload, { withCredentials: true });
};

export const resendVerificationCodeRequest = async (payload: VerificationCodeResendRequest): Promise<ApiResponse<string>> => {
  return Api.post("/auth/activate/resend", payload, { withCredentials: true });
};
