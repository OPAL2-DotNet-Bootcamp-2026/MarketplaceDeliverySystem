import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { BusinessCard } from '../../components/businesses/business-card/business-card';
import { BusinessPagination } from '../../components/businesses/business-pagination/business-pagination';
import { BusinessCategoryFilter } from '../../components/businesses/category-filter/category-filter';
import { Business, Category } from '../../models/marketplace.models';
import { CatalogService } from '../../services/catalog.service';
import { redirectIfAccessDenied } from '../login-required/login-required-navigation';

@Component({
  selector: 'app-businesses',
  imports: [BusinessCard, BusinessCategoryFilter, BusinessPagination],
  templateUrl: './businesses.html',
})
export class Businesses implements OnInit {
  private readonly catalog = inject(CatalogService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pageSize = 3;

  readonly categories = signal<Category[]>([]);
  readonly businesses = signal<Business[]>([]);
  readonly selectedCategoryId = signal<number | null>(null);
  readonly currentPage = signal(1);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.businesses().length / this.pageSize)),
  );
  readonly visibleBusinesses = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.businesses().slice(start, start + this.pageSize);
  });
  readonly pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index + 1),
  );

  async ngOnInit(): Promise<void> {
    const categoryId = Number(this.route.snapshot.queryParamMap.get('categoryId'));
    if (Number.isInteger(categoryId) && categoryId > 0) {
      this.selectedCategoryId.set(categoryId);
    }

    try {
      this.categories.set(await firstValueFrom(this.catalog.getBusinessCategories()));
    } catch {
      this.error.set('Categories could not be loaded.');
    }
    await this.loadBusinesses();
  }

  async selectCategory(categoryId: number | null): Promise<void> {
    this.selectedCategoryId.set(categoryId);
    this.currentPage.set(1);
    await this.loadBusinesses();
  }

  setPage(page: number): void {
    this.currentPage.set(Math.min(this.totalPages(), Math.max(1, page)));
  }

  private async loadBusinesses(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      this.businesses.set(await firstValueFrom(
        this.catalog.getBusinesses(this.selectedCategoryId()),
      ));
    } catch (error: unknown) {
      this.businesses.set([]);
      if (redirectIfAccessDenied(error, this.router, 'Customer')) return;
      this.error.set(
        error instanceof HttpErrorResponse && error.status === 0
          ? 'Unable to reach the API. Make sure it is running.'
          : 'Unable to load businesses. Please try again.',
      );
    } finally {
      this.loading.set(false);
    }
  }

}
