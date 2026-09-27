import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { BusinessCategoryCard } from '../../components/home/business-category-card/business-category-card';
import { FeatureItem } from '../../components/home/feature-item/feature-item';
import { PopularBusinessCard } from '../../components/home/popular-business-card/popular-business-card';
import { Category, PopularBusiness } from '../../models/marketplace.models';
import { AuthService } from '../../services/auth.service';
import { CatalogService } from '../../services/catalog.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, BusinessCategoryCard, FeatureItem, PopularBusinessCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private readonly catalog = inject(CatalogService);
  readonly auth = inject(AuthService);

  readonly categories = signal<Category[]>([]);
  readonly popularBusinesses = signal<PopularBusiness[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly businessesError = signal('');

  async ngOnInit(): Promise<void> {
    const [categoriesResult, businessesResult] = await Promise.allSettled([
      firstValueFrom(this.catalog.getHomeBusinessCategories()),
      firstValueFrom(this.catalog.getPopularBusinesses()),
    ] as const);

    if (categoriesResult.status === 'fulfilled') {
      this.categories.set(this.uniqueCategories(categoriesResult.value));
    } else {
      this.error.set(
        'Business categories could not be loaded. Make sure the API is running.',
      );
    }

    if (businessesResult.status === 'fulfilled') {
      this.popularBusinesses.set(businessesResult.value);
    } else {
      this.businessesError.set(
        'Popular businesses could not be loaded. Make sure the API is running.',
      );
    }

    this.loading.set(false);
  }

  private uniqueCategories(categories: Category[]): Category[] {
    const seen = new Set<string>();
    return categories.filter((category) => {
      const key = category.categoryName.trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

}
