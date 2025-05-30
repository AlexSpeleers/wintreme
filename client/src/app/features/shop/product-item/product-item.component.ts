import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { Product } from 'app/shared/models/product';

@Component({
  selector: 'app-product-item',
  imports: [MatCardModule, MatIcon, CurrencyPipe],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss',
})
export class ProductItemComponent {
  @Input() product?: Product;
}
