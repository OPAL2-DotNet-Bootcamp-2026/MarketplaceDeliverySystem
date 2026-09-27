import { inject } from '@angular/core';
import { CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { AuthService } from '../services/auth.service';

function loginRequiredUrl(
  router: Router,
  state: RouterStateSnapshot,
  requiredRole?: 'Customer' | 'Driver',
): UrlTree {
  return router.createUrlTree(['/login-required'], {
    queryParams: {
      returnUrl: state.url,
      ...(requiredRole ? { requiredRole } : {}),
    },
  });
}

export const customerGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return loginRequiredUrl(router, state);
  }

  return auth.isCustomer()
    ? true
    : loginRequiredUrl(router, state, 'Customer');
};

export const driverGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return loginRequiredUrl(router, state);
  }

  return auth.isDriver()
    ? true
    : loginRequiredUrl(router, state, 'Driver');
};
