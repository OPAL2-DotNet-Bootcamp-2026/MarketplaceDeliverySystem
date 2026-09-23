import { Component, EventEmitter, Input, Output } from '@angular/core';

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

  close(): void {
    this.closeSidebar.emit();
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userFullName');

    // We will replace this with Angular Router later.
    window.location.href = '/';
  }
}