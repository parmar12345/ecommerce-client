import { Component } from '@angular/core';
import { OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';


import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { environment } from '../../../../../environments/environment';
import { CartService } from '../../../cart/services/cart';

@Component({
  selector: 'app-product-details',
  imports: [],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {


  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly cartService = inject(CartService);

  product: Product | null = null;

  apiUrl = environment.apiUrl.replace('/api', '');

  isLoading = true;
  errorMessage = '';

  selectedImageUrl = '';

  selectImage(imageUrl: string): void {
  this.selectedImageUrl = this.apiUrl + imageUrl;
}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');

    if (!productId) {
      this.errorMessage = 'Product not found.';
      this.isLoading = false;
      return;
    }

    this.loadProduct(productId);
  }

  loadProduct(id: string): void {
    this.productService.getById(id).subscribe({
      next: (response) => {
        console.log('Product Details:', response);

        this.product = response;

        if (response.images.length > 0) {
          const primaryImage =
            response.images.find(image => image.isPrimary);

          this.selectedImageUrl =
            this.apiUrl + (primaryImage?.imageUrl ?? response.images[0].imageUrl);
        }

        this.isLoading = false;

        this.cdr.detectChanges();

        
      },
      error: (error) => {
        console.error('Failed to load product:', error);

        this.errorMessage = 'Failed to load product.';
        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  
  addToCart(): void {
  if (!this.product) {
    return;
  }

  this.cartService.addItem({
    productId: this.product.id,
    quantity: 1
  }).subscribe({
    next: (response) => {
      console.log('Cart updated:', response);
    },
    error: (error) => {
      console.error('Failed to add product to cart:', error);
    }
  });
}

}
