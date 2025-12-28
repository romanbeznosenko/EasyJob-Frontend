import type { User } from "./auth";

export type CVTemplateEnum = 'CREATIVE' | 'CORPORATE' | 'MINIMAL' | 'MODERN';

export const CVTemplateEnum = {
  CREATIVE: 'CREATIVE' as const,
  CORPORATE: 'CORPORATE' as const,
  MINIMAL: 'MINIMAL' as const,
  MODERN: 'MODERN' as const,
};

export type EducationResponse = {
  educationId: string;
  applierProfileId: string;
  degree: string;
  university: string;
  startDate: string;
  endDate: string;
  major: string;
  gpa: number;
};

export type ProjectResponse = {
  projectId: string;
  applierProfileId: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
};

export type ProjectRequest = {
  name: string;
  description: string;
  technologies?: string;
  link?: string;
};

export type ProjectPageResponse = {
  count: number;
  data: ProjectResponse[];
};

export type SkillResponse = {
  skillId: string;
  applierProfileId: string;
  name: string;
  level: string;
};

export type SkillRequest = {
  name: string;
  level?: string;
};

export type SkillPageResponse = {
  skills: SkillResponse[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
};

export type WorkExperienceResponse = {
  workExperienceId: string;
  applierProfileId: string;
  title: string;
  companyName: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
  location: string;
};

export type WorkExperienceRequest = {
  title: string;
  companyName: string;
  startDate: string;
  endDate: string;
  responsibilities?: string;
  location?: string;
};

export type WorkExperiencePageResponse = {
  count: number;
  data: WorkExperienceResponse[];
};

export type ApplierProfileResponse = {
  applierProfileId: string;
  user: User;
  cv: string;
  education: EducationResponse[];
  project: ProjectResponse[];
  skill: SkillResponse[];
  workExperience: WorkExperienceResponse[];
};
