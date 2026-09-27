import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { RegistrationView } from '../../components/registration/registration-view/registration-view';
import { RegistrationRequest } from '../../models/marketplace.models';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registration',
  imports: [RegistrationView],
  templateUrl: './registration.html',
})
export class Registration {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly submitting = signal(false);
  readonly error = signal('');

  async submit(request: RegistrationRequest): Promise<void> {
    this.error.set('');
    this.submitting.set(true);
    try {
      await firstValueFrom(this.auth.register(request));
      await this.router.navigate(['/login'], { queryParams: { registered: true } });
    } catch (error: unknown) {
      this.error.set(this.errorMessage(error));
    } finally {
      this.submitting.set(false);
    }
  }

  private errorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) return 'Registration failed. Please try again.';
    if (typeof error.error === 'string' && error.error.trim()) return error.error;
    return error.error?.title || 'Registration failed. Please review your information.';
  }
}
