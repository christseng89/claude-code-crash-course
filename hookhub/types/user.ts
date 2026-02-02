export type Role = "user" | "author" | "moderator" | "admin";

export interface Permission {
  resource: string;
  actions: string[];
}

export interface User {
  id: string;
  githubId: number;
  username: string;
  name?: string;
  email: string;
  avatarUrl?: string;
  profileUrl: string;
  isVerified: boolean;
  reputation: number;
  roles: Role[];
  favorites: string[];
  createdAt: string;
  lastLoginAt: string;
}
