import type { FirmRequest, FirmResponse, FirmPageResponse } from "../types/firm";
import type { ApiResponse } from "../types/general";
import { Api } from "../api/Api";

export const createFirm = async (payload: FirmRequest): Promise<ApiResponse<void>> => {
  return Api.post("/api/firm/", payload);
};

export const getUserFirm = async (): Promise<ApiResponse<FirmResponse>> => {
  return Api.get("/api/firm/");
};

export const getFirmsList = async (page: number = 1, limit: number = 10): Promise<ApiResponse<FirmPageResponse>> => {
  return Api.get("/api/firm/list", { params: { page, limit } });
};

export const editFirm = async (payload: FirmRequest): Promise<ApiResponse<void>> => {
  return Api.put("/api/firm/", payload);
};

export const uploadFirmLogo = async (file: File): Promise<ApiResponse<void>> => {
  const formData = new FormData();
  formData.append('file', file);

  return Api.put("/api/firm/logo", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const checkFirmExists = async (): Promise<ApiResponse<boolean>> => {
  return Api.get("/api/firm/check");
};
