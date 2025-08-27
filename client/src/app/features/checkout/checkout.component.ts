import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { OrderSummaryComponent } from 'app/shared/components/order-summary/order-summary.component';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { StripeService } from 'app/core/services/stripe.service';
import {
  ConfirmationToken,
  StripeAddressElement,
  StripeAddressElementChangeEvent,
  StripePaymentElement,
  StripePaymentElementChangeEvent,
} from '@stripe/stripe-js';
import { SnackbarService } from 'app/core/services/snackbar.service';
import { Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Address } from 'app/shared/models/user';
import { firstValueFrom } from 'rxjs';
import { AccountService } from 'app/core/services/account.service';
import { CheckoutDeliveryComponent } from './checkout-delivery/checkout-delivery.component';
import { CheckoutReviewComponent } from './checkout-review/checkout-review.component';
import { CartService } from 'app/core/services/cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [
    OrderSummaryComponent,
    MatStepperModule,
    RouterLink,
    MatButton,
    MatCheckboxModule,
    CheckoutDeliveryComponent,
    CheckoutReviewComponent,
    CurrencyPipe,
    MatProgressSpinnerModule,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private stripeService = inject(StripeService);
  private snackbarService = inject(SnackbarService);
  private accountService = inject(AccountService);
  protected cartService = inject(CartService);
  private router = inject(Router);
  private addressElement?: StripeAddressElement;
  private paymentElement?: StripePaymentElement;
  protected saveAddress = false;
  protected completionStatus = signal<{
    address: boolean;
    card: boolean;
    delivery: boolean;
  }>({ address: false, card: false, delivery: false });
  protected confirmationToken?: ConfirmationToken;
  loading = false;

  async ngOnInit() {
    try {
      this.addressElement = await this.stripeService.CreateAddressElement();
      this.addressElement.mount('#address-element');
      this.addressElement.on('change', this.HandleAddressChange);

      this.paymentElement = await this.stripeService.CreatePaymentElement();
      this.paymentElement.mount('#payment-element');
      this.paymentElement.on('change', this.HandlePaymentChange);
    } catch (error: any) {
      this.snackbarService.error(error.message);
    }
  }

  ngOnDestroy(): void {
    this.stripeService.DisposeElements();
  }

  private HandleAddressChange = (event: StripeAddressElementChangeEvent) => {
    this.completionStatus.update((state) => {
      state.address = event.complete;
      return state;
    });
  };

  private HandlePaymentChange = (event: StripePaymentElementChangeEvent) => {
    this.completionStatus.update((state) => {
      state.card = event.complete;
      return state;
    });
  };

  protected HandleDeliveryChange(event: boolean) {
    this.completionStatus.update((state) => {
      state.delivery = event;
      return state;
    });
  }

  protected async GetConfirmationToker() {
    try {
      if (
        Object.values(this.completionStatus()).every(
          (status) => status === true
        )
      ) {
        const result = await this.stripeService.CreateConfirmationToken();
        if (result.error) throw new Error(result.error.message);
        this.confirmationToken = result.confirmationToken;
        console.log(this.confirmationToken);
      }
    } catch (error: any) {
      this.snackbarService.error(error.message);
    }
  }

  protected async OnStepChange(event: StepperSelectionEvent) {
    if (event.selectedIndex === 1) {
      if (this.saveAddress) {
        const address = await this.GetAddressFromStripeAddress();
        address && firstValueFrom(this.accountService.UpdateAddress(address));
      }
    }
    if (event.selectedIndex === 2)
      await firstValueFrom(this.stripeService.CreateOrUpdatePaymentIntent());
    if (event.selectedIndex === 3) {
      await this.GetConfirmationToker();
    }
  }

  private async GetAddressFromStripeAddress(): Promise<Address | null> {
    const result = await this.addressElement?.getValue();
    const address = result?.value.address;
    if (address)
      return {
        line1: address.line1,
        line2: address.line2 || undefined,
        city: address.city,
        country: address.country,
        state: address.state,
        postalCode: address.postal_code,
      };
    else return null;
  }

  protected async ConfirmPayment(stepper: MatStepper) {
    this.loading = true;
    try {
      if (this.confirmationToken) {
        const result = await this.stripeService.ConfirmPayment(
          this.confirmationToken
        );
        if (result.error) {
          throw new Error(result.error.message);
        } else {
          this.cartService.DeleteCart();
          this.cartService.selectedDelivery.set(null);
          this.router.navigateByUrl('/checkout/success');
        }
      }
    } catch (error: any) {
      this.snackbarService.error(error.message || 'Something went wrong.');
      stepper.previous();
    } finally {
      this.loading = false;
    }
  }

  protected OnSaveAddressCheckbox(event: MatCheckboxChange) {
    this.saveAddress = event.checked;
  }
}
