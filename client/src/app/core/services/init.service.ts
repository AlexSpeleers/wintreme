import { inject, Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private cartService: CartService = inject(CartService);

  public Init(): Observable<any> {
    const cartId = localStorage.getItem('cart_id');
    const cart$ = cartId ? this.cartService.GetCart(cartId) : of(null);
    return cart$;
  }
}
