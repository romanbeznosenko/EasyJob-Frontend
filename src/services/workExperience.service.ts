import type { WorkExperienceRequest, WorkExperiencePageResponse } from "../types/applierProfile";
import type { ApiResponse } from "../types/general";
import { Api } from "../api/Api";

export const createWorkExperience = async (request: WorkExperienceRequest): Promise<ApiResponse<void>> => {
  return Api.post("/api/user/applier-profile/work-experience/", request);
};

export const editWorkExperience = async (workExperienceId: string, request: WorkExperienceRequest): Promise<ApiResponse<void>> => {
  return Api.put(`/api/user/applier-profile/work-experience/${workExperienceId}`, request);
};

export const getWorkExperiences = async (page: number = 1, limit: number = 10): Promise<ApiResponse<WorkExperiencePageResponse>> => {
  return Api.get("/api/user/applier-profile/work-experience/list", {
    params: { page, limit }
  });
};

export const deleteWorkExperience = async (workExperienceId: string): Promise<ApiResponse<void>> => {
  return Api.delete(`/api/user/applier-profile/work-experience/${workExperienceId}`);
};
