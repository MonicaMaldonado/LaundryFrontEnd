import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { OrderService } from '../order.service.service';
import { Order } from '../../../models/dtos/order.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent implements OnInit {

 // currentPage = 0;

  private paginator!: MatPaginator;


  orders = signal<Order[]>([]);
  displayedColumns: string[] = ['id','cliente','estado','fechaRecepcion','comentario','valor','local','usuario'];


  datasource = new MatTableDataSource(this.orders());
  pageSize : number = 10;


  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }



  ngAfterViewInit() {
    this.loadOrders();
    //this.datasource.paginator = this.paginator
    this.datasource = new MatTableDataSource(this.orders());
    this.setDataSourceAttributes();
  //  this.datasource.paginator = this.paginator;


    /* this.datasource = new MatTableDataSource(this.orders());
    if (this.datasource.paginator) {
      this.datasource.paginator.pageSize = this.pageSize;
    } */
  }


/*   @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  } */

  setDataSourceAttributes() {
   this.datasource.paginator = this.paginator;

   /*  if (this.paginator) {
      this.applyFilter('');
    } */
  }

//   applyFilter(filterValue: string) {
//     filterValue = filterValue.trim(); // Remove whitespace
//     filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
//     this.datasource.filter = filterValue;
// }

  ngOnInit() : void {
    this.loadOrders();
    this.cdr.detectChanges();

  }



  constructor(private orderService : OrderService,
      private cdr: ChangeDetectorRef
  ) {}

 loadOrders() {
    this.orderService.getOrders()
      .subscribe((data) => {

        this.orders.set(
          data.map((order: Order) => ({
            id: order.id,
            idCliente: order.idCliente,
            cliente: order.cliente,
            estado: order.estado,
            fechaRecepcion: order.fechaRecepcion,
            comentario: order.comentario,
            //fechaEntrega: order.fechaEntrega,
            valor: order.valor,
            idLocal: order.idLocal,
            local: Number(order.idLocal) === 1 ? 'Alborada' : 'Other', // Example logic for 'local'
            usuario: order.usuario,

          }))
        );



        this.datasource.data = this.orders();
        this.datasource.paginator = this.paginator;
        //this.orders.set(data);



       // this.datasource = new MatTableDataSource(this.orders());
      })

  }

  changePage(pageEvent: PageEvent) {
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    const paginatedData = this.orders().slice(startIndex, endIndex);
    this.datasource = new MatTableDataSource(paginatedData);
  }


}
