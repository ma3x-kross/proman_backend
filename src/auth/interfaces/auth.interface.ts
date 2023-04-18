export interface User {
  id: number;
  email: string;
}
export interface UserWithTokens extends User {
  accessToken: string;
  refreshToken: string;
}
