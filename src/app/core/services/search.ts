import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Search {
    private readonly searchSubject = new BehaviorSubject<string>('');

  readonly search$ = this.searchSubject.asObservable();

  setSearchTerm(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }
}
