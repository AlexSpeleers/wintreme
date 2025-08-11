import { CurrencyPipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CartService } from 'app/core/services/cart.service';
import { Product } from 'app/shared/models/product';

@Component({
  selector: 'app-product-item',
  imports: [MatCardModule, MatIcon, CurrencyPipe, MatButton, RouterLink],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss',
})
export class ProductItemComponent {
  @Input() product?: Product;
  cartService = inject(CartService);
}
