import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { OrdersView } from '../../components/order-history/orders-view/orders-view';
import { OrderHistoryItem } from '../../models/marketplace.models';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-history',
  imports: [OrdersView],
  templateUrl: './order-history.html',
})
export class OrderHistory implements OnInit {
  private readonly ordersApi = inject(OrderService);
  readonly auth = inject(AuthService);
  private readonly pageSize = 5;

  readonly orders = signal<OrderHistoryItem[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly search = signal('');
  readonly status = signal('all');
  readonly sort = signal('newest');
  readonly currentPage = signal(1);
  readonly filteredOrders = computed(() => {
    const search = this.search().trim().toLowerCase();
    const status = this.status();
    const sorted = this.orders().filter((order) => {
      const matchesSearch = !search || String(order.orderId).includes(search)
        || order.products.some((product) => product.productName.toLowerCase().includes(search));
      const matchesStatus = status === 'all' || this.normalizeStatus(order.orderStatus) === status;
      return matchesSearch && matchesStatus;
    });
    return [...sorted].sort((left, right) => {
      if (this.sort() === 'amount-high') return right.totalAmount - left.totalAmount;
      if (this.sort() === 'amount-low') return left.totalAmount - right.totalAmount;
      const difference = new Date(right.orderDate).getTime() - new Date(left.orderDate).getTime();
      return this.sort() === 'oldest' ? -difference : difference;
    });
  });
  readonly visibleOrders = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredOrders().slice(start, start + this.pageSize);
  });
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredOrders().length / this.pageSize)));
  readonly pages = computed(() => Array.from({ length: this.totalPages() }, (_, index) => index + 1));
  readonly pendingCount = computed(() => this.orders().filter((order) => this.normalizeStatus(order.orderStatus) === 'pending').length);
  readonly completedCount = computed(() => this.orders().filter((order) => ['delivered', 'completed'].includes(this.normalizeStatus(order.orderStatus))).length);
  readonly cancelledCount = computed(() => this.orders().filter((order) => this.normalizeStatus(order.orderStatus) === 'cancelled').length);

  async ngOnInit(): Promise<void> {
    if (!this.auth.isAuthenticated()) {
      this.error.set('Please log in to view your orders.');
      this.loading.set(false);
      return;
    }
    try {
      this.orders.set(await firstValueFrom(this.ordersApi.getOrderHistory()));
    } catch {
      this.error.set('Unable to load your orders. Make sure the API is running.');
    } finally {
      this.loading.set(false);
    }
  }

  updateSearch(value: string): void { this.search.set(value); this.currentPage.set(1); }
  updateStatus(value: string): void { this.status.set(value); this.currentPage.set(1); }
  updateSort(value: string): void { this.sort.set(value); this.currentPage.set(1); }
  setPage(page: number): void { this.currentPage.set(Math.min(this.totalPages(), Math.max(1, page))); }
  normalizeStatus(status: string): string { return status.trim().toLowerCase(); }
}
