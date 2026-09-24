import { Routes } from '@angular/router';

import { TrackOrder } from './trackOrder/TrackOrder';
import { DeliveredStatus } from './DeliveredStatus/DeliveredStatus';
export const routes: Routes = [
    {
        path: 'track-order',
        component: TrackOrder
    },
    {
        path: 'delivered-status',
        component: DeliveredStatus
    }
];