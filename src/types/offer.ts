import type { FirmResponse } from './firm';

export type OfferRequest = {
  name: string;
  description: string;
  responsibilities: string;
  requirements: string;
};

export type OfferResponse = {
  offerId: string;
  name: string;
  description: string;
  responsibilities: string;
  requirements: string;
  firm: FirmResponse;
};

export type OfferPageResponse = {
  count: number;
  data: OfferResponse[];
};
