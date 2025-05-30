import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from 'app/core/services/shop.service';
import { Product } from 'app/shared/models/product';
import { ProductItemComponent } from './product-item/product-item.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
  imports: [MatCardModule, ProductItemComponent],
})
export class ShopComponent implements OnInit {
  private shopService = inject(ShopService);
  protected products: Product[] = [];

  ngOnInit(): void {
    this.shopService.getProducts().subscribe({
      next: (response) => (this.products = response.data),
      error: (error) => console.error(error),
    });
  }
}
