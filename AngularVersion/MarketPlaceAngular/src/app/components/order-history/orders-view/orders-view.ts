import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { OrderHistoryItem } from '../../../models/marketplace.models';

@Component({
  selector: 'app-orders-view',
  imports: [FormsModule, RouterLink],
  templateUrl: './orders-view.html',
  styleUrl: './orders-view.css',
})
export class OrdersView {
  readonly orders = input.required<OrderHistoryItem[]>();
  readonly filteredOrders = input.required<OrderHistoryItem[]>();
  readonly visibleOrders = input.required<OrderHistoryItem[]>();
  readonly pendingCount = input.required<number>();
  readonly completedCount = input.required<number>();
  readonly cancelledCount = input.required<number>();
  readonly loading = input(false);
  readonly error = input('');
  readonly authenticated = input(false);
  readonly search = input('');
  readonly status = input('all');
  readonly sort = input('newest');
  readonly currentPage = input(1);
  readonly totalPages = input(1);
  readonly pages = input.required<number[]>();
  readonly searchChanged = output<string>();
  readonly statusChanged = output<string>();
  readonly sortChanged = output<string>();
  readonly pageSelected = output<number>();

  updateSearch(value: string): void { this.searchChanged.emit(value); }
  updateStatus(value: string): void { this.statusChanged.emit(value); }
  updateSort(value: string): void { this.sortChanged.emit(value); }
  formatDate(value: string): string { return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }
}
