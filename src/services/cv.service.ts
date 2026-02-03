import type { ApiResponse } from "../types/general";
import type { CVPageResponse, CVEditRequest, ModifyCVRequest } from "../types/cv";
import { Api } from "../api/Api";

export const modifyCV = async (
  offerId: string,
  request: ModifyCVRequest
): Promise<ApiResponse<void>> => {
  return Api.post(`/api/offer-application/offer/${offerId}/modify-cv`, request);
};

export const listCVs = async (
  applierProfileId: string,
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<CVPageResponse>> => {
  return Api.get(`/api/applier-profile/${applierProfileId}/cv/list`, {
    params: { page, limit }
  });
};

export const deleteCV = async (
  applierProfileId: string,
  cvId: string
): Promise<ApiResponse<void>> => {
  return Api.delete(`/api/applier-profile/${applierProfileId}/cv/${cvId}`);
};

export const editCV = async (
  applierProfileId: string,
  cvId: string,
  editRequest: CVEditRequest
): Promise<ApiResponse<void>> => {
  return Api.put(`/api/applier-profile/${applierProfileId}/cv/${cvId}`, editRequest);
};
