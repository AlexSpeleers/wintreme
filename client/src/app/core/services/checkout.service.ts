import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DeliveryMethod } from 'app/shared/models/deliveryMethod';
import { environment } from 'environments/environment';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  deliveryMethods: DeliveryMethod[] = [];

  GetDeliveryMethods() {
    if (this.deliveryMethods.length > 0) return of(this.deliveryMethods);
    return this.http
      .get<DeliveryMethod[]>(this.baseUrl + 'payments/delivery-methods')
      .pipe(
        map((methods) => {
          return (this.deliveryMethods = methods.sort(
            (a, b) => b.price - a.price
          ));
        })
      );
  }
}
