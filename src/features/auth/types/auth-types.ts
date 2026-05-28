export type RegisterRequest = {
  email: string;
  password: string;
  fullName: string;
  organizationName: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};