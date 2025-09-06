import { inject, Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { forkJoin, Observable, of, tap } from 'rxjs';
import { AccountService } from './account.service';
import { SignalrService } from './signalr.service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private cartService: CartService = inject(CartService);
  private accountService = inject(AccountService);
  private signalrService = inject(SignalrService);

  public Init(): Observable<any> {
    const cartId = localStorage.getItem('cart_id');
    const cart$ = cartId ? this.cartService.GetCart(cartId) : of(null);
    return forkJoin({
      cart: cart$,
      user: this.accountService.GetUserInfo().pipe(
        tap((user) => {
          if (user) this.signalrService.CreateHubConnection();
        })
      ),
    });
  }
}
