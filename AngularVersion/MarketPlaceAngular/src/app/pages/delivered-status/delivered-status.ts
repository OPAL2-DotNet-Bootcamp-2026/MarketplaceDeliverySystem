import { Component, OnInit, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { DeliveryUpdate } from '../../components/delivered-status/delivery-update/delivery-update';
import { Delivery } from '../../models/marketplace.models';
import { AuthService } from '../../services/auth.service';
import { DeliveryService } from '../../services/delivery.service';

@Component({
  selector: 'app-delivered-status',
  imports: [DeliveryUpdate],
  templateUrl: './delivered-status.html',
})
export class DeliveredStatus implements OnInit {
  private readonly deliveries = inject(DeliveryService);
  private readonly auth = inject(AuthService);

  readonly delivery = signal<Delivery | null>(null);
  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly completed = signal(false);
  readonly error = signal('');

  async ngOnInit(): Promise<void> {
    await this.loadDelivery();
  }

  async markDelivered(): Promise<void> {
    const delivery = this.delivery();
    if (!delivery) {
      this.error.set('No active delivery was found.');
      return;
    }
    this.submitting.set(true);
    this.error.set('');
    try {
      const response = await firstValueFrom(this.deliveries.markDelivered(delivery.deliveryId));
      if (!response.success) throw new Error(response.message);
      this.delivery.update((value) => value ? { ...value, orderStatus: 'Delivered' } : value);
      this.completed.set(true);
    } catch (error: unknown) {
      this.error.set(error instanceof Error ? error.message : 'Failed to mark the delivery as delivered.');
    } finally {
      this.submitting.set(false);
    }
  }

  async nextDelivery(): Promise<void> {
    this.completed.set(false);
    await this.loadDelivery();
  }

  private async loadDelivery(): Promise<void> {
    if (!this.auth.isAuthenticated()) {
      this.error.set('Please log in as a driver first.');
      this.loading.set(false);
      return;
    }
    this.loading.set(true);
    this.error.set('');
    try {
      this.delivery.set(await firstValueFrom(this.deliveries.getMyDelivery()));
    } catch {
      this.delivery.set(null);
      this.error.set('Could not load your current delivery.');
    } finally {
      this.loading.set(false);
    }
  }
}
