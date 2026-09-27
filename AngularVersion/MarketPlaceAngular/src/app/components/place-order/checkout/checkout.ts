import { Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CartItem } from '../../../models/marketplace.models';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  readonly items = input.required<CartItem[]>();
  readonly subtotal = input.required<number>();
  readonly deliveryFee = input.required<number>();
  readonly vat = input.required<number>();
  readonly total = input.required<number>();
  readonly submitting = input(false);
  readonly error = input('');
  readonly orderId = input<number | null>(null);
  readonly selectedPayment = model('');
  readonly quantityChanged = output<{ productId: number; delta: number }>();
  readonly orderSubmitted = output<void>();
  readonly successClosed = output<void>();

  imageUrl(value: string): string {
    if (!value) return '/assets/img/ProductPlaceHolder.png';
    return /^(https?:|data:|\/)/i.test(value) ? value : `/assets/img/${value}`;
  }

  usePlaceholder(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.onerror = null;
    image.src = '/assets/img/ProductPlaceHolder.png';
  }
}
