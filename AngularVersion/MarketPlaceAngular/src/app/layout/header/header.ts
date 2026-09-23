import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [],
    templateUrl: './header.html',
    styleUrl: './header.css'
})
export class Header {
    // is called when the button is clicked.
    @Output() menuToggle = new EventEmitter<void>();

    openMenu(): void {
        this.menuToggle.emit();
    }
}