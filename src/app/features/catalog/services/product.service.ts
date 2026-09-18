import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment.development';
import { Product } from '../models/product.model';
import { ProductQuery } from '../models/product-query.model';
import { PagedResult } from '../models/paged-result.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/Product`;

  getAll(query?: ProductQuery): Observable<PagedResult<Product>> {
    let params = new HttpParams();

    if (query?.pageNumber !== undefined) {
      params = params.set('pageNumber', query.pageNumber);
    }

    if (query?.pageSize !== undefined) {
      params = params.set('pageSize', query.pageSize);
    }

    if (query?.search) {
      params = params.set('search', query.search);
    }

    if (query?.categoryId) {
      params = params.set('categoryId', query.categoryId);
    }

    if (query?.minPrice !== undefined) {
      params = params.set('minPrice', query.minPrice);
    }

    if (query?.maxPrice !== undefined) {
      params = params.set('maxPrice', query.maxPrice);
    }

    if (query?.sortBy) {
      params = params.set('sortBy', query.sortBy);
    }

    if (query?.sortDirection) {
      params = params.set('sortDirection', query.sortDirection);
    }

    return this.http.get<PagedResult<Product>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
}