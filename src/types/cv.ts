export type ProcessStatusEnum = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export const ProcessStatusEnum = {
  PENDING: 'PENDING' as const,
  PROCESSING: 'PROCESSING' as const,
  COMPLETED: 'COMPLETED' as const,
  FAILED: 'FAILED' as const,
};

export type CVResponse = {
  cvId: string;
  storageKey: string;
  filename: string;
  thumbnail: string;
  processStatus: ProcessStatusEnum;
  createdAt: string;
};

export type CVPageResponse = {
  count: number;
  data: CVResponse[];
};

export type CVEditRequest = {
  filename: string;
};
