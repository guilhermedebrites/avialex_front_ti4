/**
 * Tipos para o domínio de Reviews
 * Baseado nas entidades e DTOs do backend
 */

export enum ReviewType {
  COMMUNICATION = "COMMUNICATION",
  SERVICE = "SERVICE",
  PROCESS = "PROCESS"
}

export interface ReviewRequestDTO {
  id?: number;
  userId: number;
  rating: number;
  comment: string;
  reviewType: ReviewType;
}

export interface ReviewResponseDTO {
  id: number;
  userId: number;
  username: string;
  rating: number;
  comment: string;
  reviewType: ReviewType;
  reviewDate: string;
  lastModified: string;
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
