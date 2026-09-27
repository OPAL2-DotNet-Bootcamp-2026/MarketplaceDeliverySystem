import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Business } from '../../../models/marketplace.models';

@Component({
  selector: 'app-business-card',
  imports: [RouterLink],
  templateUrl: './business-card.html',
  styleUrl: './business-card.css',
})
export class BusinessCard {
  readonly business = input.required<Business>();

  logoUrl(): string {
    const value = this.business().logoUrl;
    if (!value) return '/assets/img/LogoPlaceHolder.png';
    return /^(https?:|data:|\/)/i.test(value) ? value : `/assets/img/${value}`;
  }

  formatHours(): string {
    const business = this.business();
    if (!business.openingTime || !business.closingTime) return 'Hours unavailable';
    return `${this.formatTime(business.openingTime)} – ${this.formatTime(business.closingTime)}`;
  }

  usePlaceholder(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.onerror = null;
    image.src = '/assets/img/LogoPlaceHolder.png';
  }

  private formatTime(value: string): string {
    const [hoursValue, minutes = '00'] = value.split(':');
    const hours = Number(hoursValue);
    const suffix = hours >= 12 ? 'PM' : 'AM';
    return `${hours % 12 || 12}:${minutes} ${suffix}`;
  }
}
