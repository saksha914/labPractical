export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  creator: User;
  participants: User[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  username: string;
} 