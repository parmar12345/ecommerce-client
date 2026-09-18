import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { inject } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CategoryService  {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/Category`;

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  getById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }
}
