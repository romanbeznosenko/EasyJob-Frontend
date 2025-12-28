import qs from "qs";
import axios, { AxiosError } from "axios";

import { authContextRef } from "../contexts/AuthContext";

type CustomErrorInterceptor = (error: AxiosError) => Promise<AxiosError>;

export const generateApiService = (baseURL?: string) => {
  return axios.create({
    baseURL,
    timeout: 30000,
    withXSRFToken: true,
    withCredentials: true,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    paramsSerializer: {
      serialize: (params) => qs.stringify(params, { arrayFormat: "brackets" }),
    },
  });
};

export const generateCommonApiService = (
  baseURL?: string,
  customErrorInterceptor?: CustomErrorInterceptor
) => {
  const apiService = generateApiService(baseURL);

  apiService.interceptors.response.use(
    (response) => {
      return response.data;
    },
    async (error: AxiosError) => {
      // Only logout on 401 if:
      // 1. We have a response (not a network error)
      // 2. It's not a login/logout/register endpoint
      const isAuthEndpoint = error.config?.url?.includes('/auth/login') ||
                            error.config?.url?.includes('/auth/logout') ||
                            error.config?.url?.includes('/auth/register') ||
                            error.config?.url?.includes('/csrf');

      if (error.response?.status === 401 && !isAuthEndpoint) {
        authContextRef?.current?.logoutUser();
        return Promise.reject(error);
      }

      if (customErrorInterceptor) {
        return customErrorInterceptor(error);
      }

      return Promise.reject(error);
    }
  );

  return apiService;
};
