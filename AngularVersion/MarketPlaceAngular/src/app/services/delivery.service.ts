import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Delivery, DeliveryResponse } from '../models/marketplace.models';
import { API_BASE_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class DeliveryService {
  private readonly http = inject(HttpClient);

  getMyDelivery() {
    return this.http.get<Delivery>(`${API_BASE_URL}/delivery/my-delivery`);
  }

  markDelivered(deliveryId: number) {
    return this.http.put<DeliveryResponse>(
      `${API_BASE_URL}/delivery/${deliveryId}/status`,
      { status: 'Delivered' },
    );
  }
}
