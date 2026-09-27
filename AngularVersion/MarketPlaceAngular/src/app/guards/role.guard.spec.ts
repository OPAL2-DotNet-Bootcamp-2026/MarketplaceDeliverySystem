import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router';

import { AuthService } from '../services/auth.service';
import { customerGuard, driverGuard } from './role.guard';

describe('role guards', () => {
  let authenticated = false;
  let customer = false;
  let driver = false;
  let router: Router;

  const auth = {
    isAuthenticated: () => authenticated,
    isCustomer: () => customer,
    isDriver: () => driver,
  };

  beforeEach(() => {
    authenticated = false;
    customer = false;
    driver = false;

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: auth },
      ],
    });
    router = TestBed.inject(Router);
  });

  it('sends a guest to the login-required page', () => {
    const result = runGuard(customerGuard, '/businesses');

    expect(result).toBeInstanceOf(UrlTree);
    expect(router.serializeUrl(result as UrlTree)).toBe(
      '/login-required?returnUrl=%2Fbusinesses',
    );
  });

  it('allows a customer to open customer pages', () => {
    authenticated = true;
    customer = true;

    expect(runGuard(customerGuard, '/orders')).toBe(true);
  });

  it('prevents a driver from opening customer pages', () => {
    authenticated = true;
    driver = true;

    const result = runGuard(customerGuard, '/orders');

    expect(result).toBeInstanceOf(UrlTree);
    expect(router.serializeUrl(result as UrlTree)).toContain(
      'requiredRole=Customer',
    );
  });

  it('allows a driver to open the delivery page', () => {
    authenticated = true;
    driver = true;

    expect(runGuard(driverGuard, '/delivered-status')).toBe(true);
  });

  function runGuard(guard: CanActivateFn, url: string) {
    return TestBed.runInInjectionContext(() =>
      guard(
        {} as ActivatedRouteSnapshot,
        { url } as RouterStateSnapshot,
      ),
    );
  }
});
