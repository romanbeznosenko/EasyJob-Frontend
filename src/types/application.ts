import type { OfferResponse } from './offer';
import type { User } from './auth';

export enum ApplicationStatus {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export type EducationResponse = {
  educationId: string;
  applierProfileId: string;
  degree: string;
  university: string;
  startDate: string;
  endDate: string;
  major: string;
  gpa?: number;
};

export type ProjectResponse = {
  projectId: string;
  applierProfileId: string;
  name: string;
  description: string;
  technologies: string;
  link?: string;
};

export type SkillResponse = {
  skillId: string;
  applierProfileId: string;
  name: string;
  level: string;
};

export type WorkExperienceResponse = {
  workExperienceId: string;
  applierProfileId: string;
  title: string;
  companyName: string;
  startDate: string;
  endDate?: string;
  responsibilities: string;
  location?: string;
};

export type ApplierProfileResponse = {
  applierProfileId: string;
  user: User;
  cv?: string;
  education?: EducationResponse[];
  project?: ProjectResponse[];
  skill?: SkillResponse[];
  workExperience?: WorkExperienceResponse[];
};

export type OfferApplicationResponse = {
  offerApplicationId: string;
  offer: OfferResponse;
  applierProfile: ApplierProfileResponse;
  status: ApplicationStatus;
  isOpened: boolean;
  createdAt: string;
};

export type OfferApplicationPageResponse = {
  count: number;
  data: OfferApplicationResponse[];
};
