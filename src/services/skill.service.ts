import type { SkillRequest, SkillPageResponse } from "../types/applierProfile";
import type { ApiResponse } from "../types/general";
import { Api } from "../api/Api";

export const createSkill = async (request: SkillRequest): Promise<ApiResponse<void>> => {
  return Api.post("/api/user/applier-profile/skill/", request);
};

export const editSkill = async (skillId: string, request: SkillRequest): Promise<ApiResponse<void>> => {
  return Api.put(`/api/user/applier-profile/skill/${skillId}`, request);
};

export const getSkills = async (page: number = 1, limit: number = 10): Promise<ApiResponse<SkillPageResponse>> => {
  return Api.get("/api/user/applier-profile/skill/list", {
    params: { page, limit }
  });
};

export const deleteSkill = async (skillId: string): Promise<ApiResponse<void>> => {
  return Api.delete(`/api/user/applier-profile/skill/${skillId}`);
};
