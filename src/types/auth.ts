export type LoginPayload = {
  email: string;
  password: string;
  staySignedIn?: boolean;
};

export type RegisterPayload = {
  name: string;
  surname: string;
  email: string;
  password: string;
  userType?: UserTypeEnum;
  description?: string;
};

export type ChangePassword = {
  currentPassword: string;
  password: string;
  confirmPassword: string;
};

export type UserTypeEnum = 'RECRUITER' | 'APPLIER';

export const UserTypeEnum = {
  RECRUITER: 'RECRUITER' as const,
  APPLIER: 'APPLIER' as const,
};

export type User = {
  id: string;
  email: string;
  name: string;
  surname: string;
  userType: UserTypeEnum;
  blocked: boolean;
};

export type UserEditRequest = {
  name?: string;
  surname?: string;
  email?: string;
};

export type UserDeleteRequest = {
  password: string;
};
