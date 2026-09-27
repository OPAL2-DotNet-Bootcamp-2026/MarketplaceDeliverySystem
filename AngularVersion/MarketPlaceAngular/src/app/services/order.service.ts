import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import {
  ActiveOrder,
  CreateOrderResponse,
  OrderDetails,
  OrderHistoryItem,
  OrderPayload,
} from '../models/marketplace.models';
import { API_BASE_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);

  createOrder(payload: OrderPayload) {
    return this.http.post<CreateOrderResponse>(
      `${API_BASE_URL}/api/Order/CreateOrder`,
      payload,
    );
  }

  getActiveOrders() {
    return this.http.get<ActiveOrder[]>(
      `${API_BASE_URL}/api/Order/GetMyActiveOrders`,
    );
  }

  getOrderHistory() {
    return this.http.get<OrderHistoryItem[]>(
      `${API_BASE_URL}/api/Order/GetMyOrderHistory`,
    );
  }

  getOrderById(orderId: number) {
    return this.http.get<OrderDetails>(
      `${API_BASE_URL}/api/Order/GetOrderById/${orderId}`,
    );
  }
}
