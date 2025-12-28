import type { OfferRequest, OfferResponse, OfferPageResponse } from "../types/offer";
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

export const getAllOffers = async (page: number = 1, limit: number = 10): Promise<ApiResponse<OfferPageResponse>> => {
  return Api.get("/api/offer/all", { params: { page, limit } });
};

export const deleteOffer = async (offerId: string): Promise<ApiResponse<void>> => {
  return Api.delete(`/api/offer/${offerId}`);
};
