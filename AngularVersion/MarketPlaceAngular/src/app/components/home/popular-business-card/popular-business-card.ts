import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PopularBusiness } from '../../../models/marketplace.models';

@Component({
  selector: 'app-popular-business-card',
  imports: [RouterLink],
  templateUrl: './popular-business-card.html',
  styleUrl: './popular-business-card.css',
})
export class PopularBusinessCard {
  readonly business = input.required<PopularBusiness>();

  logoUrl(): string {
    const value = this.business().logoUrl;
    if (!value) return '/assets/img/LogoPlaceHolder.png';
    return /^(https?:|data:|\/)/i.test(value) ? value : `/assets/img/${value}`;
  }

  formatHours(): string {
    const business = this.business();
    if (!business.openingTime || !business.closingTime) return 'Hours unavailable';
    return `${this.formatTime(business.openingTime)} - ${this.formatTime(business.closingTime)}`;
  }

  orderLabel(): string {
    const count = this.business().orderCount;
    if (count < 1) return 'New business';
    return count === 1 ? '1 order' : `${count} orders`;
  }

  usePlaceholder(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.onerror = null;
    image.src = '/assets/img/LogoPlaceHolder.png';
  }

  private formatTime(value: string): string {
    const [hoursValue, minutes = '00'] = value.split(':');
    const hours = Number(hoursValue);
    if (Number.isNaN(hours)) return value;
    const period = hours >= 12 ? 'PM' : 'AM';
    return `${hours % 12 || 12}:${minutes} ${period}`;
  }
}
