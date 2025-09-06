import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Order, OrderToCreate } from 'app/shared/models/order';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  public orderComplete = false;

  public CreateOrder(OrderToCreate: OrderToCreate) {
    return this.http.post<Order>(this.baseUrl + 'orders', OrderToCreate);
  }

  public GetOrdersForUser() {
    return this.http.get<Order[]>(this.baseUrl + 'orders');
  }

  public GetOrderDetailed(id: number) {
    return this.http.get<Order>(this.baseUrl + 'orders/' + id);
  }
}
