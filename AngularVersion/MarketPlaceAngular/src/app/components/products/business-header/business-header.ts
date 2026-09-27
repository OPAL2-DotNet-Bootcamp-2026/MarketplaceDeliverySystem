import { Component, input } from '@angular/core';

import { BusinessHeader as BusinessHeaderModel } from '../../../models/marketplace.models';

@Component({
  selector: 'app-business-header',
  imports: [],
  templateUrl: './business-header.html',
  styleUrl: './business-header.css',
})
export class BusinessHeader {
  readonly business = input<BusinessHeaderModel | null>(null);
  readonly loading = input(false);

  logoUrl(): string {
    const value = this.business()?.logoUrl;
    if (!value) return '/assets/img/LogoPlaceHolder.png';
    return /^(https?:|data:|\/)/i.test(value) ? value : `/assets/img/${value}`;
  }

  formatHours(): string {
    const business = this.business();
    if (!business?.openingTime || !business.closingTime) return 'Hours unavailable';
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
    return `${hours % 12 || 12}:${minutes} ${hours >= 12 ? 'PM' : 'AM'}`;
  }
}
