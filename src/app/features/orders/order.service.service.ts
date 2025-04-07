import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../../models/dtos/order.model';
import { CreateOrderRequestDto } from '../../models/dtos/create-order-dto';
import { OrderResponseDto } from '../../models/dtos/order-response-dto';
import { OrderDetalle } from '../../models/dtos/orderdetalle.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {


  orderItems: OrderDetalle[] = [];

  private apiUrl = `${environment.apiUrl}`;

  constructor(private http : HttpClient) { }

  getOrders(page:number = 1)
  : Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/api/orden?${page}`);
  }

  getOrderByIdF(id : string) : Observable<Order>{
    return this.http.get<Order>(`${this.apiUrl}/api/orden/${id}`);
  }

  creatyOrder(order : CreateOrderRequestDto)
  : Observable<OrderResponseDto>  {
    return this.http.post<OrderResponseDto>(`${this.apiUrl}/api/orden`, order);
  }

  updateOrder(idOrden: number, idOrdenDetalle: number[], estado: string) : Observable<OrderResponseDto> {
    return this.http.put<OrderResponseDto>(`${this.apiUrl}/api/orden/${idOrden}`, {idOrdenDetalle, estado});
  }

  getLastOrderI() : Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/api/orden/last`);

  }

}
