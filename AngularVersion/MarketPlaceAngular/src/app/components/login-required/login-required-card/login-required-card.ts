import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-required-card',
  imports: [RouterLink],
  templateUrl: './login-required-card.html',
  styleUrl: './login-required-card.css',
})
export class LoginRequiredCard {
  readonly returnUrl = input('/');
  readonly requiredRole = input<'Customer' | 'Driver' | null>(null);

  readonly title = computed(() =>
    this.requiredRole()
      ? `${this.requiredRole()} access required`
      : 'Please log in to continue',
  );

  readonly message = computed(() => {
    const role = this.requiredRole();
    return role
      ? `This page is available only to logged-in ${role.toLowerCase()} accounts.`
      : 'You need to be logged in before you can open this page.';
  });
}
