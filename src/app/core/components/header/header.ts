import {
  Component,
  EventEmitter,
  Output,
  inject
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Search } from '../../services/search';

@Component({
  selector: 'app-header',
  imports: [RouterLink, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  @Output() search = new EventEmitter<string>();

  private readonly searchService = inject(Search);

  searchTerm = '';

  onSearch(): void {
    console.log('Search button clicked');
    console.log('Search term:', this.searchTerm);

    const searchTerm = this.searchTerm.trim();

    this.searchService.setSearchTerm(searchTerm);
  }
}