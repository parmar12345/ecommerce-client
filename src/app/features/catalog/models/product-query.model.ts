export interface ProductQuery {
  pageNumber?: number;
  pageSize?: number;

  search?: string;
  categoryId?: string;

  minPrice?: number;
  maxPrice?: number;

  sortBy?: string;
  sortDirection?: string;
}