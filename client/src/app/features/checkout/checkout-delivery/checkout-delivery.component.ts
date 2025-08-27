import { Component, inject, OnInit, output } from '@angular/core';
import { CheckoutService } from 'app/core/services/checkout.service';
import { MatRadioModule } from '@angular/material/radio';
import { CurrencyPipe } from '@angular/common';
import { CartService } from 'app/core/services/cart.service';
import { DeliveryMethod } from 'app/shared/models/deliveryMethod';

@Component({
  selector: 'app-checkout-delivery',
  imports: [MatRadioModule, CurrencyPipe],
  templateUrl: './checkout-delivery.component.html',
  styleUrl: './checkout-delivery.component.scss',
})
export class CheckoutDeliveryComponent implements OnInit {
  protected checkoutService = inject(CheckoutService);
  protected cartService = inject(CartService);
  protected deliveryComplete = output<boolean>();

  ngOnInit(): void {
    this.checkoutService.GetDeliveryMethods().subscribe({
      next: (methods) => {
        if (this.cartService.cart()?.deliveryMethodId) {
          const method = methods.find(
            (x) => x.id === this.cartService.cart()?.deliveryMethodId
          );
          if (method) {
            this.cartService.selectedDelivery.set(method);
            this.deliveryComplete.emit(true);
          }
        }
      },
    });
  }
  UpdateDeliveryMethod(method: DeliveryMethod) {
    this.cartService.selectedDelivery.set(method);
    const cart = this.cartService.cart();
    if (cart) {
      cart.deliveryMethodId = method.id;
      this.cartService.SetCart(cart);
      this.deliveryComplete.emit(true);
    }
  }
}
