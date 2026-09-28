import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { TrackingView } from '../../components/track-order/tracking-view/tracking-view';
import { ActiveOrder } from '../../models/marketplace.models';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { redirectIfAccessDenied, showLoginRequired } from '../login-required/login-required-navigation';

@Component({
  selector: 'app-track-order',
  imports: [TrackingView],
  templateUrl: './track-order.html',
})
export class TrackOrder implements OnInit {
  private readonly ordersApi = inject(OrderService);
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);

  readonly orders = signal<ActiveOrder[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  async ngOnInit(): Promise<void> {
    if (!this.auth.isAuthenticated()) {
      showLoginRequired(this.router);
      this.loading.set(false);
      return;
    }
    try {
      this.orders.set(await firstValueFrom(this.ordersApi.getActiveOrders()));
    } catch (error: unknown) {
      if (redirectIfAccessDenied(error, this.router, 'Customer')) return;
      this.error.set(
        error instanceof HttpErrorResponse && error.status === 0
          ? 'Unable to reach the API. Make sure it is running.'
          : 'Unable to load active orders. Please try again.',
      );
    } finally {
      this.loading.set(false);
    }
  }

}
