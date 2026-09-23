import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  @Input() isOpen = false;

  @Output() closeSidebar = new EventEmitter<void>();

  constructor(private router: Router) {}

  close(): void {
    this.closeSidebar.emit();
  }

  goToTrackOrder(): void {
    this.close();
    this.router.navigate(['/track-order']);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userFullName');

    window.location.href = '/';
  }
}