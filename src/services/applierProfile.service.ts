import type { ApplierProfileResponse, CVTemplateEnum } from "../types/applierProfile";
import type { ApiResponse } from "../types/general";
import { Api } from "../api/Api";

export const getApplierProfile = async (): Promise<ApiResponse<ApplierProfileResponse>> => {
  return Api.get("/api/user/applier-profile/");
};

export const generateCV = async (template: CVTemplateEnum): Promise<ApiResponse<string>> => {
  return Api.post("/api/user/applier-profile/cv", null, {
    params: { template }
  });
};
