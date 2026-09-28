import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { Checkout } from '../../components/place-order/checkout/checkout';
import { OrderPayload } from '../../models/marketplace.models';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { redirectIfAccessDenied, showLoginRequired } from '../login-required/login-required-navigation';

@Component({
  selector: 'app-place-order',
  imports: [Checkout],
  templateUrl: './place-order.html',
})
export class PlaceOrder implements OnInit {
  private readonly orders = inject(OrderService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly cart = inject(CartService);

  readonly deliveryFee = 0.700;
  readonly vat = computed(() => this.cart.subtotal() * 0.05);
  readonly total = computed(() => this.cart.subtotal() + this.deliveryFee + this.vat());
  readonly submitting = signal(false);
  readonly error = signal('');
  readonly orderId = signal<number | null>(null);
  selectedPayment = '';

  readonly paymentMethods = [
    { value: 'Cash On Delivery', title: 'Cash on delivery', detail: 'Pay at your doorstep', icon: '◒' },
    { value: 'Apple Pay', title: 'Apple Pay', detail: 'Fast mobile checkout', icon: '●' },
    { value: 'Credit/Debit Card', title: 'Credit / debit card', detail: 'Secure card payment', icon: '▭' },
  ];

  ngOnInit(): void {
    if (!this.auth.isAuthenticated()) showLoginRequired(this.router);
  }

  async submitOrder(): Promise<void> {
    this.error.set('');

    if (!this.auth.isAuthenticated()) {
      showLoginRequired(this.router);
      return;
    }

    if (!this.cart.items().length) {
      this.error.set('Your order bag is empty.');
      return;
    }
    if (!this.selectedPayment) {
      this.error.set('Choose a payment method before placing the order.');
      return;
    }
    const items = this.cart.items();
    const payload: OrderPayload = {
      businessId: items[0].businessId,
      paymentMethod: this.selectedPayment,
      orderItems: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    this.submitting.set(true);
    try {
      const result = await firstValueFrom(this.orders.createOrder(payload));
      this.orderId.set(result.orderId);
      this.rememberOrder(result.orderId);
      this.cart.clear();
    } catch (error: unknown) {
      if (redirectIfAccessDenied(error, this.router, 'Customer')) return;
      this.error.set(
        error instanceof HttpErrorResponse && error.status === 0
          ? 'Unable to reach the API. Make sure it is running.'
          : "We couldn't place your order. Review your bag and try again.",
      );
    } finally {
      this.submitting.set(false);
    }
  }

  private rememberOrder(orderId: number): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('lastOrderId', String(orderId));
      localStorage.setItem('lastPaymentMethod', this.selectedPayment);
    }
    if (typeof sessionStorage !== 'undefined') {
      const ids: number[] = JSON.parse(sessionStorage.getItem('trackedOrderIds') || '[]');
      if (!ids.includes(orderId)) ids.push(orderId);
      sessionStorage.setItem('trackedOrderIds', JSON.stringify(ids));
    }
  }
}
