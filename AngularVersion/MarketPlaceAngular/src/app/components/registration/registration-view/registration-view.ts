import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { RegistrationRequest } from '../../../models/marketplace.models';

@Component({
  selector: 'app-registration-view',
  imports: [FormsModule, RouterLink],
  templateUrl: './registration-view.html',
  styleUrl: './registration-view.css',
})
export class RegistrationView {
  readonly submitting = input(false);
  readonly error = input('');
  readonly submitted = output<RegistrationRequest>();
  fullName = '';
  email = '';
  phoneNumber = '';
  password = '';
  address = '';
  terms = false;

  submit(): void {
    this.submitted.emit({
      fullName: this.fullName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      password: this.password,
      address: this.address,
    });
  }
}
