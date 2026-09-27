import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Delivery } from '../../../models/marketplace.models';

@Component({
  selector: 'app-delivery-update',
  imports: [FormsModule],
  templateUrl: './delivery-update.html',
  styleUrl: './delivery-update.css',
})
export class DeliveryUpdate {
  readonly delivery = input<Delivery | null>(null);
  readonly loading = input(false);
  readonly submitting = input(false);
  readonly completed = input(false);
  readonly error = input('');
  readonly deliveryConfirmed = output<void>();
  readonly nextRequested = output<void>();
  selectedPhoto: File | null = null;
  deliveryNote = '';

  onPhotoSelected(event: Event): void {
    this.selectedPhoto = (event.target as HTMLInputElement).files?.[0] || null;
  }
}
