import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Delivery {
  deliveryId: number;
  orderId: number;
  orderStatus?: string;
}

interface DeliveryResponse {
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-delivered-status',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './DeliveredStatus.html',
  styleUrl: './DeliveredStatus.css'
})
export class DeliveredStatus implements OnInit {

  private readonly API_URL = 'https://localhost:7299';

  deliveryId: number | null = null;
  orderId: number | null = null;
  orderStatus = 'On the Way';

  deliveryNote = '';
  selectedPhoto: File | null = null;

  isConfirming = false;
  deliveryCompleted = false;
  isLoading = true;

  ngOnInit(): void {
    this.loadDelivery();
  }

  async loadDelivery(): Promise<void> {

    const token = localStorage.getItem('authToken');

    if (!token) {
      alert('Please login first.');
      this.isLoading = false;
      return;
    }

    try {

      const response = await fetch(
        `${this.API_URL}/delivery/my-delivery`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(
          `Request failed with status ${response.status}`
        );
      }

      const delivery: Delivery = await response.json();

      console.log('Current delivery:', delivery);

      this.deliveryId = delivery.deliveryId;
      this.orderId = delivery.orderId;

      if (delivery.orderStatus) {
        this.orderStatus = delivery.orderStatus;
      }

    } catch (error: unknown) {

      console.error(
        'Failed to load delivery:',
        error
      );

      alert('Could not load your delivery.');

    } finally {
      this.isLoading = false;
    }
  }

  onPhotoSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {

      this.selectedPhoto = input.files[0];

      console.log(
        'Selected photo:',
        this.selectedPhoto
      );
    }
  }

  async markAsDelivered(): Promise<void> {

    if (!this.deliveryId) {

      alert('No delivery was found.');

      this.isConfirming = false;

      return;
    }

    const token = localStorage.getItem('authToken');

    if (!token) {

      alert('Please login first.');

      this.isConfirming = false;

      return;
    }

    try {

      this.isConfirming = true;

      const response = await fetch(
        `${this.API_URL}/delivery/${this.deliveryId}/status`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            status: 'Delivered'
          })
        }
      );

      if (!response.ok) {

        throw new Error(
          `Request failed with status ${response.status}`
        );
      }

      const result: DeliveryResponse =
        await response.json();

      console.log(
        'Backend response:',
        result
      );

      if (!result.success) {
        throw new Error(result.message);
      }

      this.orderStatus = 'Delivered';

      this.deliveryCompleted = true;

      console.log(result.message);

    } catch (error: unknown) {

      console.error(
        'Failed to mark delivery as delivered:',
        error
      );

      this.isConfirming = false;

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(
          'Failed to mark delivery as delivered.'
        );
      }
    }
  }

  nextDelivery(): void {

    window.location.reload();

  }
}