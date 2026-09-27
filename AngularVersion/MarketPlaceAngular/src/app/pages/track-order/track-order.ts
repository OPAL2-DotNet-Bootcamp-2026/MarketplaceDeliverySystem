import { Component, OnInit, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { TrackingView } from '../../components/track-order/tracking-view/tracking-view';
import { ActiveOrder } from '../../models/marketplace.models';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-track-order',
  imports: [TrackingView],
  templateUrl: './track-order.html',
})
export class TrackOrder implements OnInit {
  private readonly ordersApi = inject(OrderService);
  readonly auth = inject(AuthService);

  readonly orders = signal<ActiveOrder[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  async ngOnInit(): Promise<void> {
    if (!this.auth.isAuthenticated()) {
      this.error.set('Please log in to track your orders.');
      this.loading.set(false);
      return;
    }
    try {
      this.orders.set(await firstValueFrom(this.ordersApi.getActiveOrders()));
    } catch {
      this.error.set('Unable to load active orders. Make sure the API is running.');
    } finally {
      this.loading.set(false);
    }
  }

}
