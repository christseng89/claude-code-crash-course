import { Hook } from "./hook";
import { User } from "./user";

export interface Installation {
  id: string;
  hookId: string;
  hook?: Hook;
  userId: string;
  user?: User;
  version: string;
  config?: Record<string, unknown>;
  installedAt: string;
  lastUsed: string;
  usageCount: number;
}

export interface Review {
  id: string;
  hookId: string;
  hook?: Hook;
  userId: string;
  user?: User;
  rating: number; // 1-5
  title: string;
  content: string;
  helpful: number;
  version: string;
  createdAt: string;
  updatedAt: string;
}
