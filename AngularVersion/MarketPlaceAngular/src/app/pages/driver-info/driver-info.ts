import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { DriverStatus } from '../../components/driver-info/driver-status/driver-status';
import { OrderDetails } from '../../models/marketplace.models';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-driver-info',
  imports: [DriverStatus],
  templateUrl: './driver-info.html',
})
export class DriverInfo implements OnInit {
  private readonly orders = inject(OrderService);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  readonly order = signal<OrderDetails | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');

  async ngOnInit(): Promise<void> {
    if (!this.auth.isAuthenticated()) {
      this.error.set('Please log in first.');
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
    } catch {
      this.error.set('Unable to load driver information.');
    } finally {
      this.loading.set(false);
    }
  }
}
