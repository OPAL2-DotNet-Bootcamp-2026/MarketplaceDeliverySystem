import { Component, input, output } from '@angular/core';

import { Product } from '../../../models/marketplace.models';

@Component({
  selector: 'app-product-details-modal',
  imports: [],
  templateUrl: './product-details-modal.html',
  styleUrl: './product-details-modal.css',
})
export class ProductDetailsModal {
  readonly product = input.required<Product>();
  readonly quantity = input(0);
  readonly closed = output<void>();
  readonly quantityChange = output<number>();
  readonly addToOrder = output<void>();

  imageUrl(): string {
    const value = this.product().imageUrl;
    if (!value) return '/assets/img/ProductPlaceHolder.png';
    return /^(https?:|data:|\/)/i.test(value) ? value : `/assets/img/${value}`;
  }

  usePlaceholder(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.onerror = null;
    image.src = '/assets/img/ProductPlaceHolder.png';
  }
}
