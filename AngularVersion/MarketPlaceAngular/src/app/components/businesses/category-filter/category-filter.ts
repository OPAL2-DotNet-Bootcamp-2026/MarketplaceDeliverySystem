import { Component, input, output } from '@angular/core';

import { Category } from '../../../models/marketplace.models';

@Component({
  selector: 'app-business-category-filter',
  imports: [],
  templateUrl: './category-filter.html',
  styleUrl: './category-filter.css',
})
export class BusinessCategoryFilter {
  readonly categories = input.required<Category[]>();
  readonly selectedCategoryId = input<number | null>(null);
  readonly categorySelected = output<number | null>();

  categoryEmoji(name: string): string {
    const value = name.toLowerCase();
    if (value.includes('restaurant')) return '🍽️';
    if (value.includes('kitchen') || value.includes('traditional')) return '🥘';
    if (value.includes('bakery') || value.includes('sweet')) return '🧁';
    if (value.includes('perfume') || value.includes('oud')) return '✦';
    if (value.includes('flower')) return '💐';
    return '🛍️';
  }
}
