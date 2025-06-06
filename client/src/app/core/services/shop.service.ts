import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Pagination } from 'app/shared/models/pagination';
import { Product } from 'app/shared/models/product';
import { ShopParams } from 'app/shared/models/shopParams';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  private baseUrl = 'https://localhost:5001/api/';
  private http = inject(HttpClient);
  types: string[] = [];
  brands: string[] = [];

  GetProducts(shopParams: ShopParams): Observable<Pagination<Product>> {
    var params = new HttpParams();

    if (shopParams.brands.length > 0)
      params = params.append('brands', shopParams.brands.join(','));

    if (shopParams.types.length > 0)
      params = params.append('types', shopParams.types.join(','));

    if (shopParams.sort) params = params.append('sort', shopParams.sort);

    if (shopParams.search) params = params.append('search', shopParams.search);

    params = params.append('pageSize', shopParams.pageSize);
    params = params.append('pageIndex', shopParams.pageNumber);

    return this.http.get<Pagination<Product>>(this.baseUrl + 'products', {
      params,
    });
  }

  GetProduct(id: number): Observable<Product> {
    return this.http.get<Product>(this.baseUrl + 'products/' + id);
  }

  GetBrands(): Subscription | null {
    if (this.brands.length > 0) return null;
    return this.http.get<string[]>(this.baseUrl + 'products/brands').subscribe({
      next: (response) => (this.brands = response),
    });
  }

  GetTypes(): Subscription | null {
    if (this.types.length > 0) return null;
    return this.http.get<string[]>(this.baseUrl + 'products/types').subscribe({
      next: (response) => (this.types = response),
    });
  }
}
