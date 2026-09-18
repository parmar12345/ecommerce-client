import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { environment } from '../../../../../environments/environment';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { Search } from '../../../../core/services/search';

@Component({
  selector: 'app-product-list',
  imports: [FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit, OnDestroy {

  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly searchService = inject(Search);
  private readonly cdr = inject(ChangeDetectorRef);

  private searchSubscription?: Subscription;

  products: Product[] = [];
  categories: Category[] = [];

  selectedCategoryId: string | null = null;

  searchTerm = '';

  minPrice: number | undefined = undefined;
  maxPrice: number | undefined = undefined;

  sortBy = 'createdAt';
  sortDirection = 'desc';

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalCount = 0;

  apiUrl = environment.apiUrl.replace('/api', '');

  ngOnInit(): void {

    this.categoryService.getAll().subscribe({
      next: (response) => {
        this.categories = response;

        console.log('Categories:', this.categories);

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load categories:', error);
      },
    });

    this.searchSubscription =
      this.searchService.search$.subscribe({
        next: (searchTerm) => {

          this.searchTerm = searchTerm;
          this.currentPage = 1;

          console.log('Search received:', searchTerm);

          this.loadProducts();
        },
      });
  }



  loadProducts(): void {

    this.productService.getAll({
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      search: this.searchTerm || undefined,
      categoryId: this.selectedCategoryId ?? undefined,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      sortBy: this.sortBy,
      sortDirection: this.sortDirection,
    }).subscribe({
      next: (response) => {

        this.products = response.items;

        this.currentPage = response.pageNumber;
        this.pageSize = response.pageSize;
        this.totalCount = response.totalCount;
        this.totalPages = response.totalPages;

        console.log('Products:', this.products);
        console.log('Current page:', this.currentPage);
        console.log('Total pages:', this.totalPages);
        console.log('Total count:', this.totalCount);

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load products:', error);
      },
    });
  }

  selectCategory(categoryId: string | null): void {

    this.selectedCategoryId = categoryId;
    this.currentPage = 1;

    this.loadProducts();
  }

  filterByPrice(
    minPrice: number | undefined,
    maxPrice: number | undefined
  ): void {

    this.minPrice = minPrice;
    this.maxPrice = maxPrice;
    this.currentPage = 1;

    this.loadProducts();
  }

  searchProducts(): void {

    this.loadProducts();
  }

  ngOnDestroy(): void {

    this.searchSubscription?.unsubscribe();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategoryId = null;
    this.minPrice = undefined;
    this.maxPrice = undefined;

    this.loadProducts();
  }


  sortProducts(sortBy: string, sortDirection: string): void {

    this.sortBy = sortBy;
    this.sortDirection = sortDirection;

    this.loadProducts();
  }

  onSortChange(value: string): void {

    switch (value) {

      case 'price-low':
        this.sortBy = 'price';
        this.sortDirection = 'asc';
        break;

      case 'price-high':
        this.sortBy = 'price';
        this.sortDirection = 'desc';
        break;

      case 'name':
        this.sortBy = 'name';
        this.sortDirection = 'asc';
        break;

      default:
        this.sortBy = 'createdAt';
        this.sortDirection = 'desc';
        break;
    }

    this.currentPage = 1;
    this.loadProducts();

    this.loadProducts();
  }

  nextPage(): void {

    if (this.currentPage >= this.totalPages) {
      return;
    }

    this.currentPage++;

    this.loadProducts();
  }

  previousPage(): void {

    if (this.currentPage <= 1) {
      return;
    }

    this.currentPage--;

    this.loadProducts();
  }
}