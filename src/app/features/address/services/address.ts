import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Address } from '../models/address';
import { CreateAddressRequest } from '../models/create-address-request.model.ts';
import { UpdateAddressRequest } from '../models/update-address-request.model.ts';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/Address`;

  getAll(): Observable<Address[]> {
    return this.http.get<Address[]>(this.apiUrl);
  }

  getById(id: string): Observable<Address> {
    return this.http.get<Address>(
      `${this.apiUrl}/${id}`
    );
  }

  create(
    request: CreateAddressRequest
  ): Observable<Address> {
    return this.http.post<Address>(
      this.apiUrl,
      request
    );
  }

  update(
    id: string,
    request: UpdateAddressRequest
  ): Observable<Address> {
    return this.http.put<Address>(
      `${this.apiUrl}/${id}`,
      request
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }

  setDefault(id: string): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${id}/default`,
      {}
    );
  }
}