import type { FirmResponse } from './firm';

export type EmploymentTypeEnum = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';

export const EmploymentTypeEnum = {
  FULL_TIME: 'FULL_TIME' as const,
  PART_TIME: 'PART_TIME' as const,
  CONTRACT: 'CONTRACT' as const,
  INTERNSHIP: 'INTERNSHIP' as const,
};

export const EmploymentTypeLabels: Record<EmploymentTypeEnum, string> = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
};

export type ExperienceLevelEnum = 'JUNIOR' | 'MID' | 'SENIOR';

export const ExperienceLevelEnum = {
  JUNIOR: 'JUNIOR' as const,
  MID: 'MID' as const,
  SENIOR: 'SENIOR' as const,
};

export const ExperienceLevelLabels: Record<ExperienceLevelEnum, string> = {
  JUNIOR: 'Junior',
  MID: 'Mid',
  SENIOR: 'Senior',
};

export type WorkModeEnum = 'REMOTE' | 'HYBRID' | 'ON_SITE';

export const WorkModeEnum = {
  REMOTE: 'REMOTE' as const,
  HYBRID: 'HYBRID' as const,
  ON_SITE: 'ON_SITE' as const,
};

export const WorkModeLabels: Record<WorkModeEnum, string> = {
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
  ON_SITE: 'On-site',
};

export type OfferRequest = {
  name: string;
  description: string;
  responsibilities: string;
  requirements: string;
  isSalaryDisclosed: boolean;
  salaryBottom: number;
  salaryTop: number;
  employmentType: EmploymentTypeEnum;
  experienceLevel: ExperienceLevelEnum;
  workMode: WorkModeEnum;
  skills: string[];
};

export type OfferResponse = {
  offerId: string;
  name: string;
  description: string;
  responsibilities: string;
  requirements: string;
  firm: FirmResponse;
  isSalaryDisclosed: boolean;
  salaryBottom: number;
  salaryTop: number;
  employmentType: EmploymentTypeEnum;
  experienceLevel: ExperienceLevelEnum;
  workMode: WorkModeEnum;
  skills: string[];
};

export type OfferPageResponse = {
  count: number;
  data: OfferResponse[];
};

export type OfferFilters = {
  experienceLevels?: ExperienceLevelEnum[];
  employmentTypes?: EmploymentTypeEnum[];
  workModes?: WorkModeEnum[];
  skills?: string[];
  name?: string;
  salaryBottom?: number;
  salaryTop?: number;
};
