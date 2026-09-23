import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class Orders {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/Orders`;

  getAll(): Observable<Order[]> {

    return this.http.get<Order[]>(
      this.apiUrl
    );
  }

  getById(orderId: string): Observable<Order> {

    return this.http.get<Order>(
      `${this.apiUrl}/${orderId}`
    );
  }
}