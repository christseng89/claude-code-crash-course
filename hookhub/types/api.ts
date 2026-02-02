import { Hook } from "./hook";
import { Review, Installation } from "./installation";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface ApiMeta {
  requestId: string;
  timestamp: string;
}

export interface HooksResponse {
  data: Hook[];
  pagination: PaginationMeta;
  meta: ApiMeta;
}

export interface HookDetailResponse {
  data: Hook;
  related: Hook[];
}

export interface SearchResponse {
  data: Hook[];
  suggestions: string[];
  facets: {
    categories: Record<string, number>;
    tags: Record<string, number>;
  };
  pagination: PaginationMeta;
  meta: ApiMeta;
}

export interface CategoryResponse {
  data: {
    name: string;
    icon: string;
    count: number;
  }[];
}

export interface InstallationsResponse {
  data: Installation[];
  pagination: PaginationMeta;
  meta: ApiMeta;
}

export interface ReviewsResponse {
  data: Review[];
  pagination: PaginationMeta;
  meta: ApiMeta;
}

export interface StarResponse {
  data: {
    starred: boolean;
    totalStars: number;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    path?: string;
  };
}
