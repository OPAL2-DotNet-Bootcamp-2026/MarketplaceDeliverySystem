import { Routes } from '@angular/router';

import { Businesses } from './pages/businesses/businesses';
import { DeliveredStatus } from './pages/delivered-status/delivered-status';
import { DriverInfo } from './pages/driver-info/driver-info';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { OrderHistory } from './pages/order-history/order-history';
import { PlaceOrder } from './pages/place-order/place-order';
import { Products } from './pages/products/products';
import { Registration } from './pages/registration/registration';
import { TrackOrder } from './pages/track-order/track-order';

export const routes: Routes = [
  { path: '', component: Home, title: 'Marketplace · Home' },
  { path: 'businesses', component: Businesses, title: 'Marketplace · Businesses' },
  { path: 'businesses/:businessId/products', component: Products, title: 'Marketplace · Products' },
  { path: 'place-order', component: PlaceOrder, title: 'Marketplace · Place order' },
  { path: 'orders', component: OrderHistory, title: 'Marketplace · Order history' },
  { path: 'track-order', component: TrackOrder, title: 'Marketplace · Track order' },
  { path: 'driver-info', component: DriverInfo, title: 'Marketplace · Driver information' },
  { path: 'driver-info/:orderId', component: DriverInfo, title: 'Marketplace · Driver information' },
  { path: 'delivered-status', component: DeliveredStatus, title: 'Marketplace · Delivery status' },
  { path: 'login', component: Login, title: 'Marketplace · Login' },
  { path: 'registration', component: Registration, title: 'Marketplace · Sign up' },
  { path: 'products', redirectTo: 'businesses', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
