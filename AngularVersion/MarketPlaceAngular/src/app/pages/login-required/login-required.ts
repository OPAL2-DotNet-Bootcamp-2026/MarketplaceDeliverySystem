import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LoginRequiredCard } from '../../components/login-required/login-required-card/login-required-card';

@Component({
  selector: 'app-login-required',
  imports: [LoginRequiredCard],
  templateUrl: './login-required.html',
})
export class LoginRequired {
  private readonly route = inject(ActivatedRoute);

  readonly returnUrl = this.safeReturnUrl(
    this.route.snapshot.queryParamMap.get('returnUrl'),
  );
  readonly requiredRole = this.readRequiredRole(
    this.route.snapshot.queryParamMap.get('requiredRole'),
  );

  private safeReturnUrl(value: string | null): string {
    return value?.startsWith('/') && !value.startsWith('//') ? value : '/';
  }

  private readRequiredRole(value: string | null): 'Customer' | 'Driver' | null {
    return value === 'Customer' || value === 'Driver' ? value : null;
  }
}
