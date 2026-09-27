import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { LoginRequest } from '../../../models/marketplace.models';

@Component({
  selector: 'app-login-view',
  imports: [FormsModule, RouterLink],
  templateUrl: './login-view.html',
  styleUrl: './login-view.css',
})
export class LoginView {
  readonly submitting = input(false);
  readonly error = input('');
  readonly registered = input(false);
  readonly submitted = output<LoginRequest>();
  email = '';
  password = '';
  remember = false;

  submit(): void {
    this.submitted.emit({ email: this.email, password: this.password });
  }
}
