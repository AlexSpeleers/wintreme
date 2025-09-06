import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from 'app/core/services/order.service';
import { Order } from 'app/shared/models/order';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order',
  imports: [RouterLink, DatePipe, CurrencyPipe],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent implements OnInit {
  private orderService = inject(OrderService);
  orders: Order[] = [];
  ngOnInit(): void {
    this.orderService.GetOrdersForUser().subscribe({
      next: (orders) => (this.orders = orders),
    });
  }
}
