import { Component, input, output } from '@angular/core';

import { Product } from '../../../models/marketplace.models';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  readonly product = input.required<Product>();
  readonly quantity = input(0);
  readonly selected = output<void>();
  readonly quantityChange = output<number>();
  readonly addToOrder = output<void>();

  changeQuantity(delta: number): void {
    this.quantityChange.emit(delta);
  }

  selectProduct(): void {
    this.selected.emit();
  }

  requestAddToOrder(): void {
    this.addToOrder.emit();
  }

  imageUrl(): string {
    const value = this.product().imageUrl;
    if (!value) {
      return '/assets/img/ProductPlaceHolder.png';
    }
    if (/^(https?:|data:|\/)/i.test(value)) {
      return value;
    }
    return `/assets/img/${value}`;
  }

  usePlaceholder(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.onerror = null;
    image.src = '/assets/img/ProductPlaceHolder.png';
  }
}
