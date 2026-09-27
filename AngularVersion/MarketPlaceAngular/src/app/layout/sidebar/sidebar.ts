import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);
  readonly cart = inject(CartService);
  @Input() isOpen = false;
  @Output() readonly closeSidebar = new EventEmitter<void>();

  close(): void { this.closeSidebar.emit(); }

  logout(): void {
    this.auth.logout();
    this.close();
    void this.router.navigate(['/']);
  }
}
