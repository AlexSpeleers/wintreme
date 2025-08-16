import { inject, Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { forkJoin, Observable, of } from 'rxjs';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private cartService: CartService = inject(CartService);
  private accountService = inject(AccountService);

  public Init(): Observable<any> {
    const cartId = localStorage.getItem('cart_id');
    const cart$ = cartId ? this.cartService.GetCart(cartId) : of(null);
    return forkJoin({
      cart: cart$,
      user: this.accountService.GetUserInfo(),
    });
  }
}
