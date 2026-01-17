import type { ApiResponse } from "../types/general";
import type { OfferApplicationPageResponse } from "../types/application";
import type { OfferApplicationEvaluationResponse } from "../types/evaluation";
import { Api } from "../api/Api";

export const applyForOffer = async (offerId: string, cvId: string): Promise<ApiResponse<void>> => {
  return Api.post(`/api/offer-application/offer/${offerId}/apply`, null, {
    params: { cv: cvId }
  });
};

export const getUserApplications = async (page: number = 1, limit: number = 10): Promise<ApiResponse<OfferApplicationPageResponse>> => {
  return Api.get("/api/offer-application/me/list", { params: { page, limit } });
};

export const changeApplicationStatus = async (offerApplicationId: string, status: string): Promise<ApiResponse<void>> => {
  return Api.put(`/api/offer-application/${offerApplicationId}/status?status=${status}`);
};

export const getOfferApplications = async (offerId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<OfferApplicationPageResponse>> => {
  return Api.get(`/api/offer-application/offer/${offerId}/list`, { params: { page, limit } });
};

export const evaluateApplication = async (offerApplicationId: string): Promise<ApiResponse<void>> => {
  return Api.post(`/api/offer-application/${offerApplicationId}/evaluation`);
};

export const getEvaluation = async (offerApplicationId: string): Promise<ApiResponse<OfferApplicationEvaluationResponse>> => {
  return Api.get(`/api/offer-application/${offerApplicationId}/evaluation/`);
};

export const openApplication = async (offerApplicationId: string): Promise<ApiResponse<void>> => {
  return Api.put(`/api/offer-application/${offerApplicationId}/open`);
};

export const getFirmApplications = async (page: number = 1, limit: number = 10): Promise<ApiResponse<OfferApplicationPageResponse>> => {
  return Api.get(`/api/offer-application/firm/list`, { params: { page, limit } });
};
