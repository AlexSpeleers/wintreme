import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  ConfirmationToken,
  loadStripe,
  Stripe,
  StripeAddressElement,
  StripeAddressElementOptions,
  StripeElements,
  StripePaymentElement,
} from '@stripe/stripe-js';
import { environment } from 'environments/environment';
import { CartService } from './cart.service';
import { Cart } from 'app/shared/models/cart';
import { firstValueFrom, map, Observable } from 'rxjs';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private baseUrl = environment.apiUrl;
  private cartSevice = inject(CartService);
  private accountService = inject(AccountService);
  private http = inject(HttpClient);
  private stripePromise: Promise<Stripe | null>;
  private stripeElements?: StripeElements;
  private addressElement?: StripeAddressElement;
  private paymentElement?: StripePaymentElement;

  constructor() {
    this.stripePromise = loadStripe(environment.stripePublicKey);
  }

  private GetStripeInstance = () => this.stripePromise;

  private async InitializeElements(): Promise<StripeElements> {
    if (!this.stripeElements) {
      const stripe = await this.GetStripeInstance();
      if (stripe) {
        const cart = await firstValueFrom(this.CreateOrUpdatePaymentIntent());
        this.stripeElements = stripe.elements({
          clientSecret: cart.clientSecret,
          appearance: { labels: 'floating' },
        });
      } else {
        throw new Error('Stripe has not been loaded.');
      }
    }
    return this.stripeElements;
  }

  public async CreatePaymentElement() {
    if (!this.paymentElement) {
      const elements = await this.InitializeElements();
      if (elements) {
        this.paymentElement = elements.create('payment');
      } else throw new Error('Elements instance has not been initialized');
    }
    return this.paymentElement;
  }

  public async CreateAddressElement() {
    if (!this.addressElement) {
      const elements = await this.InitializeElements();
      if (elements) {
        const user = this.accountService.currentUser();
        let defaultValues: StripeAddressElementOptions['defaultValues'] = {};
        if (user) {
          defaultValues.name = user.firstName + ' ' + user.lastName;
        }
        if (user?.address) {
          defaultValues.address = {
            line1: user.address.line1,
            line2: user.address.line2,
            city: user.address.city,
            state: user.address.state,
            country: user.address.country,
            postal_code: user.address.postalCode,
          };
        }
        const options: StripeAddressElementOptions = {
          mode: 'shipping',
          defaultValues,
        };
        this.addressElement = elements.create('address', options);
      } else {
        throw new Error('Elements instance has not been loaded.');
      }
    }
    return this.addressElement;
  }

  public async CreateConfirmationToken() {
    const stripe = await this.GetStripeInstance();
    const elements = await this.InitializeElements();
    const result = await elements.submit();
    if (result.error) throw new Error(result.error.message);
    if (stripe) {
      return await stripe.createConfirmationToken({ elements });
    } else {
      throw new Error('Stripe not available.');
    }
  }

  public async ConfirmPayment(confirmationToken: ConfirmationToken) {
    const stripe = await this.GetStripeInstance();
    const elements = await this.InitializeElements();
    const result = await elements.submit();
    if (result.error) throw new Error(result.error.message);
    const clientSecret = this.cartSevice.cart()?.clientSecret;
    if (stripe && clientSecret) {
      return await stripe.confirmPayment({
        clientSecret: clientSecret,
        confirmParams: {
          confirmation_token: confirmationToken.id,
        },
        redirect: 'if_required',
      });
    } else {
      throw new Error('Unable to load stripe.');
    }
  }

  public CreateOrUpdatePaymentIntent(): Observable<Cart> {
    const cart = this.cartSevice.cart();
    if (!cart) throw new Error('Problem with cart.');
    return this.http.post<Cart>(this.baseUrl + 'payments/' + cart.id, {}).pipe(
      map((cart) => {
        this.cartSevice.SetCart(cart);
        return cart;
      })
    );
  }

  public DisposeElements() {
    this.stripeElements = undefined;
    this.addressElement = undefined;
    this.paymentElement = undefined;
  }
}
