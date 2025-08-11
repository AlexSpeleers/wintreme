import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from 'app/core/services/shop.service';
import { Product } from 'app/shared/models/product';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { CartService } from 'app/core/services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  imports: [
    CurrencyPipe,
    MatButton,
    MatIcon,
    MatFormFieldModule,
    MatInputModule,
    MatLabel,
    MatDividerModule,
    FormsModule,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  private shopService = inject(ShopService);
  private activatedRoute = inject(ActivatedRoute);
  private cartService = inject(CartService);
  product?: Product;
  quantityInCart = 0;
  quantity = 1;

  public ngOnInit(): void {
    this.LoadProduct();
  }

  private LoadProduct() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) return;
    this.shopService.GetProduct(+id).subscribe({
      next: (product) => {
        this.product = product;
        this.UpdateQuantityInCart();
      },
      error: (error) => console.log(error),
    });
  }

  protected UpdateCart() {
    if (!this.product) return;
    if (this.quantity > this.quantityInCart) {
      const itemsToAdd = this.quantity - this.quantityInCart;
      this.quantityInCart += itemsToAdd;
      this.cartService.AddItemToCart(this.product, itemsToAdd);
    } else {
      var itemsToRemove = this.quantityInCart - this.quantity;
      this.quantityInCart -= itemsToRemove;
      this.cartService.RemoveItemFromCart(this.product.id, itemsToRemove);
    }
  }

  private UpdateQuantityInCart() {
    this.quantityInCart =
      this.cartService
        .cart()
        ?.items.find((x) => x.productId === this.product?.id)?.quantity || 0;
    this.quantity = this.quantityInCart || 1;
  }

  protected GetButtonText() {
    return this.quantityInCart > 0 ? 'Update cart' : 'Add to cart';
  }
}
