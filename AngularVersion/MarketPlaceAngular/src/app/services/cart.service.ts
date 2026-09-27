import { Injectable, computed, signal } from '@angular/core';

import { CartItem, Product } from '../models/marketplace.models';

export type AddToCartResult = 'added' | 'different-business';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly storageKey = 'orderCart';
  private readonly itemsSignal = signal<CartItem[]>(this.readCart());

  readonly items = this.itemsSignal.asReadonly();
  readonly itemCount = computed(() => this.itemsSignal().length);
  readonly subtotal = computed(() =>
    this.itemsSignal().reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    ),
  );

  add(product: Product, businessId: number, quantity: number): AddToCartResult {
    const current = this.itemsSignal();

    if (current.length > 0 && current[0].businessId !== businessId) {
      return 'different-business';
    }

    const next = current.map((item) => ({ ...item }));
    const existing = next.find((item) => item.productId === product.productId);

    if (existing) {
      existing.quantity = Math.min(
        existing.quantity + quantity,
        Math.max(product.stockQuantity, 1),
      );
    } else {
      next.push({
        businessId,
        productId: product.productId,
        productName: product.productName,
        imageUrl: product.imageUrl || '/assets/img/ProductPlaceHolder.png',
        price: product.price,
        quantity,
      });
    }

    this.commit(next);
    return 'added';
  }

  changeQuantity(productId: number, delta: number): void {
    const next = this.itemsSignal()
      .map((item) => item.productId === productId
        ? { ...item, quantity: item.quantity + delta }
        : { ...item })
      .filter((item) => item.quantity > 0);

    this.commit(next);
  }

  clear(): void {
    this.commit([]);
  }

  private commit(items: CartItem[]): void {
    this.itemsSignal.set(items);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    }
  }

  private readCart(): CartItem[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const value: unknown = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      return Array.isArray(value) ? value as CartItem[] : [];
    } catch {
      return [];
    }
  }
}
