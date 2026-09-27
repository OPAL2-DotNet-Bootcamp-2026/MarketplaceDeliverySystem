import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-product-category-filter',
  imports: [],
  templateUrl: './category-filter.html',
  styleUrl: './category-filter.css',
})
export class ProductCategoryFilter {
  readonly businessCategoryName = input('General');
  readonly itemCount = input(0);
  readonly categories = input.required<string[]>();
  readonly selectedCategory = input('All');
  readonly categorySelected = output<string>();
}
