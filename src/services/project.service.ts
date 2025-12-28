import type { ProjectRequest, ProjectPageResponse } from "../types/applierProfile";
import type { ApiResponse } from "../types/general";
import { Api } from "../api/Api";

export const createProject = async (request: ProjectRequest): Promise<ApiResponse<void>> => {
  return Api.post("/api/user/applier-profile/project/", request);
};

export const editProject = async (projectId: string, request: ProjectRequest): Promise<ApiResponse<void>> => {
  return Api.put(`/api/user/applier-profile/project/${projectId}`, request);
};

export const getProjects = async (page: number = 1, limit: number = 10): Promise<ApiResponse<ProjectPageResponse>> => {
  return Api.get("/api/user/applier-profile/project/list", {
    params: { page, limit }
  });
};

export const deleteProject = async (projectId: string): Promise<ApiResponse<void>> => {
  return Api.delete(`/api/user/applier-profile/project/${projectId}`);
};
