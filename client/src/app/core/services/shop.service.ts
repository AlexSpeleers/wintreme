import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Pagination } from 'app/shared/models/pagination';
import { Product } from 'app/shared/models/product';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  private baseUrl = 'https://localhost:5001/api/';
  private http = inject(HttpClient);

  getProducts() {
    return this.http.get<Pagination<Product>>(
      this.baseUrl + 'products?pageSize=20'
    );
  }
}
