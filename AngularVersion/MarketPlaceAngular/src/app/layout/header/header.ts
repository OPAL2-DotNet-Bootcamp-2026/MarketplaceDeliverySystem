import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterLink],
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