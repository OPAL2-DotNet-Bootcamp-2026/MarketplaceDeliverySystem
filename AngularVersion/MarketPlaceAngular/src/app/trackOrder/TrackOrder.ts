import { Component, OnInit } from '@angular/core';

interface Order {
    orderId: number;
    orderDate: string;
    orderStatus: string;
    businessName: string;
    driverName?: string | null;
    driverPhone?: string | null;
}

interface OrderStatusInfo {
    badge: string;
    title: string;
    description: string;
    statusText: string;
    showDriverButton: boolean;
}

type OrderStatusKey =
    'placed' |
    'ready' |
    'onway' |
    'delivered';

@Component({
    selector: 'app-track-order',
    standalone: true,
    imports: [],
    templateUrl: './TrackOrder.html',
    styleUrl: './TrackOrder.css'
})
export class TrackOrder implements OnInit {

    currentOrders: Order[] = [];

    selectedDriver: Order | null = null;


    // Information for each order status
    orderStatuses: Record<OrderStatusKey, OrderStatusInfo> = {

        placed: {
            badge: 'ORDER RECEIVED',
            title: 'Your order has been received',
            description:
                "We've received your order and it is being prepared.",
            statusText: 'Order Placed',
            showDriverButton: false
        },

        ready: {
            badge: 'ORDER READY',
            title: 'Your order is ready',
            description:
                "We're waiting for a driver to pick up your order.",
            statusText: 'Order Ready',
            showDriverButton: false
        },

        onway: {
            badge: 'ON THE WAY',
            title: 'Your order is on the way!',
            description:
                'A driver has been assigned to your order and is currently delivering it.',
            statusText: 'On the Way',
            showDriverButton: true
        },

        delivered: {
            badge: 'DELIVERED',
            title: 'Your order has been delivered',
            description:
                'Your order has been successfully delivered. Enjoy your purchase!',
            statusText: 'Delivered',
            showDriverButton: false
        }
    };


    ngOnInit(): void {
        this.loadOrders();
    }


    // Convert backend status to our UI status
    convertStatus(status: string): OrderStatusKey | null {

        switch (status.toLowerCase()) {

            case 'pending':
                return 'placed';

            case 'ready':
                return 'ready';

            case 'on the way':
                return 'onway';

            case 'delivered':
                return 'delivered';

            default:
                return null;
        }
    }


    // Get current progress step
    getCurrentStep(statusKey: OrderStatusKey): number {

        switch (statusKey) {

            case 'placed':
                return 1;

            case 'ready':
                return 2;

            case 'onway':
                return 3;

            case 'delivered':
                return 4;

            default:
                return 1;
        }
    }


    formatDate(dateString: string): string {

        const date = new Date(dateString);

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }


    async loadOrders(): Promise<void> {

        const token = localStorage.getItem('authToken');

        if (!token) {
            return;
        }

        try {

            const response = await fetch(
                'https://localhost:7299/api/Order/GetMyActiveOrders',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Request failed with status ${response.status}`
                );
            }

            const orders = await response.json() as Order[];

            this.currentOrders = orders;

        } catch (error) {

            console.error(
                'Failed to load orders:',
                error
            );
        }
    }


    // Open driver information popup
    showDriverInformation(order: Order): void {

        if (!order.driverName || !order.driverPhone) {

            alert(
                'No driver has been assigned to this order.'
            );

            return;
        }

        this.selectedDriver = order;
    }


    // Close driver popup
    closeDriverModal(): void {

        this.selectedDriver = null;
    }
}