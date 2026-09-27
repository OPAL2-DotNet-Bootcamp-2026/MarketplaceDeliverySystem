import { Component, EventEmitter, HostListener, Output, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);
  readonly cart = inject(CartService);
  @Output() readonly menuToggle = new EventEmitter<void>();
  isScrolled = false;

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 100;
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/']);
  }
}
