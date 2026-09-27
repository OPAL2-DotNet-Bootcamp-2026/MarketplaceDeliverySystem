import { Component, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ActiveOrder } from '../../../models/marketplace.models';

type OrderStatusKey = 'placed' | 'ready' | 'onway' | 'delivered';

interface OrderStatusInfo {
  badge: string;
  title: string;
  description: string;
  statusText: string;
  step: number;
}

@Component({
  selector: 'app-tracking-view',
  imports: [RouterLink],
  templateUrl: './tracking-view.html',
  styleUrl: './tracking-view.css',
})
export class TrackingView {
  readonly orders = input.required<ActiveOrder[]>();
  readonly loading = input(false);
  readonly error = input('');
  readonly authenticated = input(false);
  readonly driverUnavailable = output<void>();
  readonly selectedDriver = signal<ActiveOrder | null>(null);
  readonly statusInfo: Record<OrderStatusKey, OrderStatusInfo> = {
    placed: { badge: 'Order received', title: 'Your order has been received', description: 'The business is preparing your items.', statusText: 'Order placed', step: 1 },
    ready: { badge: 'Order ready', title: 'Your order is ready', description: 'A driver will collect your order shortly.', statusText: 'Order ready', step: 2 },
    onway: { badge: 'On the way', title: 'Your order is on the way', description: 'A driver is bringing the order to your address.', statusText: 'On the way', step: 3 },
    delivered: { badge: 'Delivered', title: 'Your order has arrived', description: 'Your order was delivered successfully. Enjoy!', statusText: 'Delivered', step: 4 },
  };

  statusKey(status: string): OrderStatusKey {
    switch (status.trim().toLowerCase()) {
      case 'ready': return 'ready';
      case 'on the way': return 'onway';
      case 'delivered': return 'delivered';
      default: return 'placed';
    }
  }

  step(order: ActiveOrder): number { return this.statusInfo[this.statusKey(order.orderStatus)].step; }
  info(order: ActiveOrder): OrderStatusInfo { return this.statusInfo[this.statusKey(order.orderStatus)]; }
  formatDate(value: string): string { return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }

  showDriver(order: ActiveOrder): void {
    if (!order.driverName || !order.driverPhone) {
      this.driverUnavailable.emit();
      return;
    }
    this.selectedDriver.set(order);
  }
}
