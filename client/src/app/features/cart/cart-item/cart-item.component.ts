import { CurrencyPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CartService } from 'app/core/services/cart.service';
import { CartItem } from 'app/shared/models/cart';

@Component({
  selector: 'app-cart-item',
  imports: [RouterLink, MatButton, MatIcon, CurrencyPipe],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss',
})
export class CartItemComponent {
  public item = input.required<CartItem>();
  protected cartService = inject(CartService);

  public IncrementQuantity() {
    this.cartService.AddItemToCart(this.item());
    console.log(this.item());
  }
  public DecrementQuantity() {
    this.cartService.RemoveItemFromCart(this.item().productId);
  }
  public RemoveItemFromCart() {
    this.cartService.RemoveItemFromCart(
      this.item().productId,
      this.item().quantity
    );
  }
}
