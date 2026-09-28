import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';

import { AuthService } from './services/auth.service';
import { Businesses } from './pages/businesses/businesses';
import { DeliveredStatus } from './pages/delivered-status/delivered-status';
import { DriverInfo } from './pages/driver-info/driver-info';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { LoginRequired } from './pages/login-required/login-required';
import { OrderHistory } from './pages/order-history/order-history';
import { PlaceOrder } from './pages/place-order/place-order';
import { Products } from './pages/products/products';
import { Registration } from './pages/registration/registration';
import { TrackOrder } from './pages/track-order/track-order';

const requireRole = (role: 'Customer' | 'Driver'): CanActivateFn => (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/login-required'], {
      queryParams: { returnUrl: state.url },
    });
  }

  const hasRole = role === 'Customer' ? auth.isCustomer() : auth.isDriver();

  return hasRole
    ? true
    : router.createUrlTree(['/login-required'], {
        queryParams: { returnUrl: state.url, requiredRole: role },
      });
};

const customerAccess = requireRole('Customer');
const driverAccess = requireRole('Driver');

export const routes: Routes = [
  { path: '', component: Home, title: 'Marketplace · Home' },
  { path: 'businesses', component: Businesses, canActivate: [customerAccess], title: 'Marketplace · Businesses' },
  { path: 'businesses/:businessId/products', component: Products, canActivate: [customerAccess], title: 'Marketplace · Products' },
  { path: 'place-order', component: PlaceOrder, canActivate: [customerAccess], title: 'Marketplace · Place order' },
  { path: 'orders', component: OrderHistory, canActivate: [customerAccess], title: 'Marketplace · Order history' },
  { path: 'track-order', component: TrackOrder, canActivate: [customerAccess], title: 'Marketplace · Track order' },
  { path: 'driver-info', component: DriverInfo, canActivate: [customerAccess], title: 'Marketplace · Driver information' },
  { path: 'driver-info/:orderId', component: DriverInfo, canActivate: [customerAccess], title: 'Marketplace · Driver information' },
  { path: 'delivered-status', component: DeliveredStatus, canActivate: [driverAccess], title: 'Marketplace · Delivery status' },
  { path: 'login-required', component: LoginRequired, title: 'Marketplace · Login required' },
  { path: 'login', component: Login, title: 'Marketplace · Login' },
  { path: 'registration', component: Registration, title: 'Marketplace · Sign up' },
  { path: 'products', redirectTo: 'businesses', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
