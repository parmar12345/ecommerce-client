import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';

import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';

import { environment } from '../../../../../environments/environment';

import { Search } from '../../../../core/services/search';
import { CartService } from '../../../cart/services/cart';


@Component({
  selector: 'app-product-list',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit, OnDestroy {

  // ================================
  // Services
  // ================================

  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly searchService = inject(Search);
  private readonly cartService = inject(CartService);
  private readonly cdr = inject(ChangeDetectorRef);

  // ================================
  // Subscriptions
  // ================================

  private searchSubscription?: Subscription;

  // ================================
  // Product Data
  // ================================

  products: Product[] = [];
  categories: Category[] = [];

  // ================================
  // Filters
  // ================================

  selectedCategoryId: string | null = null;

  selectedPriceFilter = 'all';

  selectedSort = 'featured';

  searchTerm = '';

  minPrice: number | undefined = undefined;
  maxPrice: number | undefined = undefined;

  sortBy = 'createdAt';
  sortDirection = 'desc';

  // ================================
  // Pagination
  // ================================

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalCount = 0;

  // ================================
  // API
  // ================================

  apiUrl = environment.apiUrl.replace('/api', '');


  // ================================
  // Lifecycle
  // ================================

  ngOnInit(): void {

    this.categoryService.getAll().subscribe({
      next: (response) => {

        this.categories = response;

        console.log('Categories:', this.categories);

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'Failed to load categories:',
          error
        );

      },
    });


    this.searchSubscription =
      this.searchService.search$.subscribe({

        next: (searchTerm) => {

          this.searchTerm = searchTerm;

          this.currentPage = 1;

          console.log(
            'Search received:',
            searchTerm
          );

          this.loadProducts();
        },

      });

  }


  ngOnDestroy(): void {

    this.searchSubscription?.unsubscribe();

  }


  // ================================
  // Products
  // ================================

  loadProducts(): void {

    this.productService.getAll({

      pageNumber: this.currentPage,

      pageSize: this.pageSize,

      search:
        this.searchTerm || undefined,

      categoryId:
        this.selectedCategoryId ?? undefined,

      minPrice:
        this.minPrice,

      maxPrice:
        this.maxPrice,

      sortBy:
        this.sortBy,

      sortDirection:
        this.sortDirection,

    }).subscribe({

      next: (response) => {

        this.products = response.items;

        this.currentPage =
          response.pageNumber;

        this.pageSize =
          response.pageSize;

        this.totalCount =
          response.totalCount;

        this.totalPages =
          response.totalPages;


        console.log(
          'Products:',
          this.products
        );

        console.log(
          'Current page:',
          this.currentPage
        );

        console.log(
          'Total pages:',
          this.totalPages
        );

        console.log(
          'Total count:',
          this.totalCount
        );


        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error(
          'Failed to load products:',
          error
        );

      },

    });

  }


  // ================================
  // Cart
  // ================================

  addToCart(productId: string): void {
  this.cartService.addItem({
    productId: productId,
    quantity: 1
  }).subscribe({
    next: (response) => {
      console.log('Cart updated:', response);

      // Refresh products so the latest stock is displayed
      this.loadProducts();
    },
    error: (error) => {
      console.error(
        'Failed to add product to cart:',
        error
      );

      if (
        error.status === 400 &&
        error.error?.detail ===
        'Requested quantity exceeds available stock.'
      ) {
        alert('Sorry, this product is out of stock.');

        // Refresh stock information
        this.loadProducts();

        return;
      }

      alert(
        'Unable to add product to cart. Please try again.'
      );
    },
  });
}


  // ================================
  // Category Filter
  // ================================

  selectCategory(
    categoryId: string | null
  ): void {

    this.selectedCategoryId =
      categoryId;

    this.currentPage = 1;

    this.loadProducts();

  }


  // ================================
  // Price Filter
  // ================================

  filterByPrice(
    minPrice: number | undefined,
    maxPrice: number | undefined
  ): void {

    this.minPrice = minPrice;

    this.maxPrice = maxPrice;


    if (
      minPrice === undefined &&
      maxPrice === undefined
    ) {

      this.selectedPriceFilter =
        'all';

    }
    else if (
      minPrice === undefined &&
      maxPrice === 50000
    ) {

      this.selectedPriceFilter =
        'under-50000';

    }
    else if (
      minPrice === 50000 &&
      maxPrice === 100000
    ) {

      this.selectedPriceFilter =
        '50000-100000';

    }


    this.currentPage = 1;

    this.loadProducts();

  }


  // ================================
  // Search
  // ================================

  searchProducts(): void {

    this.currentPage = 1;

    this.loadProducts();

  }


  // ================================
  // Clear Filters
  // ================================

  clearFilters(): void {

    this.searchTerm = '';

    this.selectedCategoryId = null;

    this.minPrice = undefined;

    this.maxPrice = undefined;

    this.selectedPriceFilter = 'all';

    this.selectedSort = 'featured';

    this.sortBy = 'createdAt';

    this.sortDirection = 'desc';

    this.currentPage = 1;

    this.loadProducts();

  }


  // ================================
  // Sorting
  // ================================

  sortProducts(
    sortBy: string,
    sortDirection: string
  ): void {

    this.sortBy = sortBy;

    this.sortDirection =
      sortDirection;

    this.currentPage = 1;

    this.loadProducts();

  }


  onSortChange(value: string): void {

    this.selectedSort = value;


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

  }


  // ================================
  // Pagination
  // ================================

  nextPage(): void {

    if (
      this.currentPage >=
      this.totalPages
    ) {

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