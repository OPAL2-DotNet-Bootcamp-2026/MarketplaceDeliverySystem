import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { DriverStatus } from '../../components/driver-info/driver-status/driver-status';
import { OrderDetails } from '../../models/marketplace.models';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { redirectIfAccessDenied, showLoginRequired } from '../login-required/login-required-navigation';

@Component({
  selector: 'app-driver-info',
  imports: [DriverStatus],
  templateUrl: './driver-info.html',
})
export class DriverInfo implements OnInit {
  private readonly orders = inject(OrderService);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly order = signal<OrderDetails | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');

  async ngOnInit(): Promise<void> {
    if (!this.auth.isAuthenticated()) {
      showLoginRequired(this.router);
      this.loading.set(false);
      return;
    }
    const routeOrderId = Number(this.route.snapshot.paramMap.get('orderId'));
    const storedOrderId = typeof localStorage === 'undefined' ? 0 : Number(localStorage.getItem('lastOrderId'));
    const orderId = routeOrderId || storedOrderId;
    if (!orderId) {
      this.error.set('No current order was found.');
      this.loading.set(false);
      return;
    }
    try {
      this.order.set(await firstValueFrom(this.orders.getOrderById(orderId)));
    } catch (error: unknown) {
      if (redirectIfAccessDenied(error, this.router, 'Customer')) return;
      this.error.set(
        error instanceof HttpErrorResponse && error.status === 0
          ? 'Unable to reach the API. Make sure it is running.'
          : 'Unable to load driver information. Please try again.',
      );
    } finally {
      this.loading.set(false);
    }
  }
}
