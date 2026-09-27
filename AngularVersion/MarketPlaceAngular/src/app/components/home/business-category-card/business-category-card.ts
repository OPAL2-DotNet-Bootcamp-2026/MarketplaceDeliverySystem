import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Category } from '../../../models/marketplace.models';

@Component({
  selector: 'app-business-category-card',
  imports: [RouterLink],
  templateUrl: './business-category-card.html',
  styleUrl: './business-category-card.css',
})
export class BusinessCategoryCard {
  readonly category = input.required<Category>();

  icon(): string {
    const value = this.category().categoryName.toLowerCase();
    if (value.includes('perfume') || value.includes('oud')) return 'bi bi-stars';
    if (value.includes('flower')) return 'bi bi-flower1';
    if (value.includes('chocolate') || value.includes('sweet')) return 'bi bi-gift';
    if (value.includes('food') || value.includes('kitchen') || value.includes('bakery')) return 'bi bi-egg-fried';
    if (value.includes('fashion')) return 'bi bi-handbag';
    if (value.includes('decor') || value.includes('craft')) return 'bi bi-palette';
    return 'bi bi-grid';
  }
}
