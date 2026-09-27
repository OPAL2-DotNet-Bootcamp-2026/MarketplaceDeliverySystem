import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import {
  Business,
  BusinessHeader,
  Category,
  PopularBusiness,
  Product,
} from '../models/marketplace.models';
import { API_BASE_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);

  getProductCategories() {
    return this.http.get<Category[]>(
      `${API_BASE_URL}/api/Category/GetSidebarCategories`,
    );
  }

  getBusinessCategories() {
    return this.http.get<Category[]>(
      `${API_BASE_URL}/api/BusinessCategory/GetSidebarCategories`,
    );
  }

  getHomeBusinessCategories() {
    return this.http.get<Category[]>(
      `${API_BASE_URL}/api/BusinessCategory/GetHomeCategories`,
    );
  }

  getBusinesses(categoryId: number | null = null) {
    const options = categoryId === null
      ? {}
      : { params: new HttpParams().set('categoryId', categoryId) };

    return this.http.get<Business[]>(
      `${API_BASE_URL}/api/Business/GetAllBusinesses`,
      options,
    );
  }

  getPopularBusinesses(limit = 4) {
    return this.http.get<PopularBusiness[]>(
      `${API_BASE_URL}/api/Business/GetPopularBusinesses`,
      { params: new HttpParams().set('limit', limit) },
    );
  }

  getBusinessHeader(businessId: number) {
    return this.http.get<BusinessHeader>(
      `${API_BASE_URL}/api/Product/GetBusinessHeader/${businessId}`,
    );
  }

  getProducts(businessId: number, categoryId: number | null = null) {
    const options = categoryId === null
      ? {}
      : { params: new HttpParams().set('categoryId', categoryId) };

    return this.http.get<Product[]>(
      `${API_BASE_URL}/api/Product/business/${businessId}`,
      options,
    );
  }
}
