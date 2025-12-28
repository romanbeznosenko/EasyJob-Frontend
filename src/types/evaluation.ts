export enum RecommendationEnum {
  STRONG_MATCH = 'STRONG_MATCH',
  GOOD_MATCH = 'GOOD_MATCH',
  MODERATE_MATCH = 'MODERATE_MATCH',
  WEAK_MATCH = 'WEAK_MATCH'
}

export enum ProcessStatusEnum {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export type SkillsAnalysisResponse = {
  requiredSkills: string[];
  candidateHas: string[];
  missingSkills: string[];
  transferableSkills: string[];
};

export type OfferApplicationEvaluationResponse = {
  evaluationId: string;
  overallMatchScore: number;
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  projectsScore: number;
  skillsAnalysis: SkillsAnalysisResponse;
  strengths: string;
  weaknesses: string;
  culturalFit: string;
  growthPotential: string;
  interviewFocusArea: string;
  detailedSummary: string;
  recommendation: RecommendationEnum;
  processStatus: ProcessStatusEnum;
  createdAt: string;
};
