import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-business-pagination',
  imports: [],
  templateUrl: './business-pagination.html',
  styleUrl: './business-pagination.css',
})
export class BusinessPagination {
  readonly pages = input.required<number[]>();
  readonly currentPage = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly pageSelected = output<number>();
}
