export interface User {
  id: string;
  email: string;
  nickname: string;
  childAge: '0-3' | '3-6' | '6-9';
  avatar: string;
  favorites?: string[];
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nickname: string;
  childAge: '0-3' | '3-6' | '6-9';
}

export interface UpdateProfileRequest {
  nickname?: string;
  childAge?: '0-3' | '3-6' | '6-9';
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}
