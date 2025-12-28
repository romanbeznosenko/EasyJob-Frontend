import { ENV } from "../constants/env";
import { generateCommonApiService } from "../utils/generateApiService";

const { API } = ENV;

export const Api = generateCommonApiService(API);
