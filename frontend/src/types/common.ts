export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface FilterParams extends PaginationParams {
  ageRange?: string;
  theme?: string;
  search?: string;
  sort?: string;
}

export interface ReaderState {
  currentPage: number;
  isFullscreen: boolean;
  isNightMode: boolean;
}

export interface ReadingProgress {
  picturebookId: string;
  currentPage: number;
  totalPages: number;
  lastReadAt: string;
}