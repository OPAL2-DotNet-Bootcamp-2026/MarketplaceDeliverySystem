import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { LoginView } from '../../components/login/login-view/login-view';
import { LoginRequest } from '../../models/marketplace.models';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [LoginView],
  templateUrl: './login.html',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly submitting = signal(false);
  readonly error = signal('');
  readonly registered = this.route.snapshot.queryParamMap.get('registered') === 'true';

  async submit(credentials: LoginRequest): Promise<void> {
    this.error.set('');
    this.submitting.set(true);
    try {
      const response = await firstValueFrom(this.auth.login(credentials));
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      await this.router.navigateByUrl(
        returnUrl || (response.role.toLowerCase() === 'driver' ? '/delivered-status' : '/'),
      );
    } catch (error: unknown) {
      this.error.set(this.errorMessage(error, 'Invalid email or password.'));
    } finally {
      this.submitting.set(false);
    }
  }

  private errorMessage(error: unknown, fallback: string): string {
    if (!(error instanceof HttpErrorResponse)) return fallback;
    if (typeof error.error === 'string' && error.error.trim()) return error.error;
    return error.error?.title || fallback;
  }
}
