import type { User } from './auth';

export type FirmRequest = {
  name: string;
  description: string;
  location: string;
};

export type FirmResponse = {
  firmId: string;
  name: string;
  owner: User;
  description: string;
  location: string;
  logo?: string;
};

export type FirmPageResponse = {
  count: number;
  data: FirmResponse[];
};
