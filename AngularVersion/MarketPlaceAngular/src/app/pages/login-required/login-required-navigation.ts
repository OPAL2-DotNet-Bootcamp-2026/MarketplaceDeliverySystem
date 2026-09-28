import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

type RequiredRole = 'Customer' | 'Driver';

export function showLoginRequired(router: Router, requiredRole?: RequiredRole): void {
  void router.navigate(['/login-required'], {
    queryParams: {
      returnUrl: router.url,
      ...(requiredRole ? { requiredRole } : {}),
    },
  });
}

export function redirectIfAccessDenied(
  error: unknown,
  router: Router,
  requiredRole: RequiredRole,
): boolean {
  if (!(error instanceof HttpErrorResponse)) return false;

  if (error.status === 401) {
    showLoginRequired(router);
    return true;
  }
  if (error.status === 403) {
    showLoginRequired(router, requiredRole);
    return true;
  }
  return false;
}
