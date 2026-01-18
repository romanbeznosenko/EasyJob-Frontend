import type { OfferRequest, OfferResponse, OfferPageResponse, OfferFilters } from "../types/offer";
import type { ApiResponse } from "../types/general";
import { Api } from "../api/Api";

export const createOffer = async (payload: OfferRequest): Promise<ApiResponse<void>> => {
  return Api.post("/api/offer/", payload);
};

export const editOffer = async (offerId: string, payload: OfferRequest): Promise<ApiResponse<void>> => {
  return Api.put(`/api/offer/${offerId}`, payload);
};

export const getFirmOffers = async (): Promise<ApiResponse<OfferPageResponse>> => {
  return Api.get("/api/offer/firm/list");
};

export const getOffersByFirmId = async (firmId: string): Promise<ApiResponse<OfferPageResponse>> => {
  return Api.get(`/api/offer/firm/${firmId}`);
};

export const getOfferById = async (offerId: string): Promise<ApiResponse<OfferResponse>> => {
  return Api.get(`/api/offer/${offerId}`);
};

export const getAllOffers = async (
  page: number = 1,
  limit: number = 10,
  filters?: OfferFilters
): Promise<ApiResponse<OfferPageResponse>> => {
  const params: Record<string, any> = { page, limit };

  if (filters) {
    if (filters.experienceLevels && filters.experienceLevels.length > 0) {
      params.experienceLevel = filters.experienceLevels;
    }
    if (filters.employmentTypes && filters.employmentTypes.length > 0) {
      params.employmentType = filters.employmentTypes;
    }
    if (filters.workModes && filters.workModes.length > 0) {
      params.workMode = filters.workModes;
    }
    if (filters.skills && filters.skills.length > 0) {
      params.skill = filters.skills;
    }
    if (filters.name) {
      params.name = filters.name;
    }
    if (filters.salaryBottom !== undefined) {
      params.salaryBottom = filters.salaryBottom;
    }
    if (filters.salaryTop !== undefined) {
      params.salaryTop = filters.salaryTop;
    }
  }

  return Api.get("/api/offer/all", {
    params,
    paramsSerializer: {
      indexes: null // This ensures arrays are serialized as param=value1&param=value2
    }
  });
};

export const deleteOffer = async (offerId: string): Promise<ApiResponse<void>> => {
  return Api.delete(`/api/offer/${offerId}`);
};
