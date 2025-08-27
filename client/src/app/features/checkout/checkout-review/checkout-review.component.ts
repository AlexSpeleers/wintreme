import { CurrencyPipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { ConfirmationToken } from '@stripe/stripe-js';
import { CartService } from 'app/core/services/cart.service';
import { AddressPipe } from 'app/shared/pipes/address-pipe';

@Component({
  selector: 'app-checkout-review',
  imports: [CurrencyPipe, AddressPipe],
  templateUrl: './checkout-review.component.html',
  styleUrl: './checkout-review.component.scss',
})
export class CheckoutReviewComponent {
  protected cartService = inject(CartService);
  @Input() confirmationToken?: ConfirmationToken;
}
