import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { OrderDetails } from '../../../models/marketplace.models';

@Component({
  selector: 'app-driver-status',
  imports: [RouterLink],
  templateUrl: './driver-status.html',
  styleUrl: './driver-status.css',
})
export class DriverStatus {
  readonly order = input<OrderDetails | null>(null);
  readonly loading = input(false);
  readonly error = input('');
}
