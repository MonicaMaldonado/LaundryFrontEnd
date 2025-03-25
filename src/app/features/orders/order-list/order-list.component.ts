import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { OrderService } from '../order.service.service';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent implements OnInit {

  orders = signal<Order[]>([]);
  displayedColumns: string[] = ['id','cliente','estado','fechaRecepcion','comentario','fechaEntrega','idLocal','usuario'];
  
  ngOnInit() : void {
    this.loadOrders();
  }

  constructor(private orderService : OrderService) {}

 loadOrders() {
    this.orderService.getOrders()
      .subscribe((data) => {
        this.orders.set(data);
      })
  }
}
