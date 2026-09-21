import {
  Component,
  EventEmitter,
  Output,
  inject
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Search } from '../../services/search';
import { CartService } from '../../../features/cart/services/cart';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, FormsModule,AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  @Output() search = new EventEmitter<string>();

  private readonly searchService = inject(Search);
  private readonly cartService = inject(CartService);

  searchTerm = '';

  cartCount$ = this.cartService.cartCount$;

  onSearch(): void {
    console.log('Search button clicked');
    console.log('Search term:', this.searchTerm);

    const searchTerm = this.searchTerm.trim();

    this.searchService.setSearchTerm(searchTerm);
  }
}