import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { BusinessHeader as BusinessHeaderComponent } from '../../components/products/business-header/business-header';
import { ProductCategoryFilter } from '../../components/products/category-filter/category-filter';
import { ProductCard } from '../../components/products/product-card/product-card';
import { ProductDetailsModal } from '../../components/products/product-details-modal/product-details-modal';
import { BusinessHeader, Product } from '../../models/marketplace.models';
import { CartService } from '../../services/cart.service';
import { CatalogService } from '../../services/catalog.service';

@Component({
  selector: 'app-products',
  imports: [RouterLink, BusinessHeaderComponent, ProductCard, ProductCategoryFilter, ProductDetailsModal],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly catalog = inject(CatalogService);
  readonly cart = inject(CartService);

  readonly businessId = signal(0);
  readonly business = signal<BusinessHeader | null>(null);
  readonly products = signal<Product[]>([]);
  readonly selectedCategory = signal('All');
  readonly quantities = signal<Record<number, number>>({});
  readonly selectedProduct = signal<Product | null>(null);
  readonly cartMessage = signal('');
  readonly loading = signal(true);
  readonly error = signal('');
  readonly categories = computed(() => [
    'All',
    ...new Set(this.products().map((product) => product.categoryName || 'General')),
  ]);
  readonly visibleProducts = computed(() => {
    const selected = this.selectedCategory();
    return selected === 'All'
      ? this.products()
      : this.products().filter((product) => (product.categoryName || 'General') === selected);
  });

  async ngOnInit(): Promise<void> {
    const businessId = Number(this.route.snapshot.paramMap.get('businessId'));
    const categoryIdValue = this.route.snapshot.queryParamMap.get('categoryId');
    const categoryId = categoryIdValue ? Number(categoryIdValue) : null;

    if (!Number.isFinite(businessId) || businessId < 1) {
      this.error.set('No business was selected.');
      this.loading.set(false);
      return;
    }

    this.businessId.set(businessId);
    try {
      const [business, products] = await Promise.all([
        firstValueFrom(this.catalog.getBusinessHeader(businessId)),
        firstValueFrom(this.catalog.getProducts(businessId, categoryId)),
      ]);
      this.business.set(business);
      this.products.set(products);
    } catch {
      this.error.set('Products could not be loaded. Make sure the API is running.');
    } finally {
      this.loading.set(false);
    }
  }

  quantity(productId: number): number {
    return this.quantities()[productId] || 0;
  }

  updateQuantity(product: Product, delta: number): void {
    const current = this.quantity(product.productId);
    const value = Math.max(0, Math.min(product.stockQuantity, current + delta));
    this.quantities.update((quantities) => ({ ...quantities, [product.productId]: value }));
  }

  addProductToOrder(product: Product): void {
    const quantity = this.quantity(product.productId);
    if (quantity === 0) {
      this.cartMessage.set('Please select at least 1 item.');
      return;
    }
    const result = this.cart.add(product, this.businessId(), quantity);
    this.cartMessage.set(result === 'added'
      ? `Added ${quantity}x "${product.productName}" to your order!`
      : 'Finish or clear the current order before shopping from another business.');
    if (result === 'added') this.selectedProduct.set(null);
  }

}
