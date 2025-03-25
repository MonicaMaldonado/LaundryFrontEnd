import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderService } from '../order.service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateOrderRequestDto } from '../../../models/dtos/create-order-dto';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ClientService } from '../../clients/client.service'; 
import { MatSelectModule } from '@angular/material/select';
import { clientes } from '../../../models/dtos/clientes.model';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ServicesService } from '../../services.service';
import { Service } from '../../../models/service.model';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderItemComponent } from '../order-item/order-item.component';
import { MatTableModule } from '@angular/material/table';
import { ChangeDetectorRef } from '@angular/core';
import { forwardRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export interface orderDetalle {
  //servicio: string;
  servicioNombre : string;
  estado: string;
  comentario: string;
  fechaEntrega: string;
  valor: string;
}



@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatDatepickerModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatIconModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.css',
})
export class OrderFormComponent implements OnInit  {
  ordenDetalles : orderDetalle[] = [];

  private dialog = inject(MatDialog);
  private clientService = inject(ClientService);
  private _formBuilder = inject(FormBuilder);
  private orderService = inject(OrderService);
  private serviceService = inject(ServicesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  clientes : clientes[] = [];
  services : Service[] = [];

  form : FormGroup;
  orderId : string | null;
  isEditMode = signal(false);

  constructor(public changeDetectorRef: ChangeDetectorRef) {
    this.ordenDetalles= [];


    this.form = this._formBuilder.group({
      cliente: ['', Validators.required],
      estado: ['', Validators.required],
      fechaRecepcion: ['', Validators.required],
      fechaEntrega: ['', Validators.required],
      comentario: [''],
      detalles: this._formBuilder.array([
        this._formBuilder.group({
          servicio: [''],
          estado: [''], 
          comentario: [''],
          fechaEntrega: [''],
          valor: [''],
          descuento: [0]
        })
      ])
    });

    this.orderId = this.route.snapshot.paramMap.get('id');
    if(this.orderId) {
      this.isEditMode.set(true);
      this.loadOrder(this.orderId);
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(OrderItemComponent, {
      width: '75%',
      disableClose: true,
      data : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const detalleArray = this.form.get('detalles') as FormArray;
        detalleArray.clear();
        detalleArray.push(this.createDetalleFormGroup(result));
        
        
 
      this.form.setControl('detallesd', this._formBuilder.array(detalleArray.controls));
    




        this.ordenDetalles.push({
          servicioNombre: result.servicioNombre,
          estado: this.mapEstado(result.estado),
          comentario: result.comentario,
          fechaEntrega: new Date(result.fechaEntrega).toISOString().substring(0,10),
          valor: result.valor
        });
      }
    });
  }

  ngOnInit(): void {
    this.clientService.getClients()
      .subscribe(arg => this.clientes = arg.map(client => ({
        ...client,
        id: Number(client.id),
        nombres: client.nombres,
        apellidos: client.apellidos
      })));

    this.serviceService.getServicios()
      .subscribe(arg => this.services = arg.map(serv =>  ({
        ...serv,
        id: serv.id.toString(),
        costo: Number(serv.costo)
      })));
  }

  loadOrder(orderId: string) {
    this.orderService.getOrderByIdF(orderId)
      .subscribe((order) => {
        this.form.patchValue(order);
      });
  }

  saveOrder() {
    if (this.form.invalid) {
      this.snackBar.open('Por favor completa los campos correctamente', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    const orderData = this.form.value;
   /*  const detalleControl = this.form.get('detalle');
    if (detalleControl) {
      this.form.setControl('detalle', this._formBuilder.array(detalleControl.value));
    } */

   const createReq: CreateOrderRequestDto = { ...orderData, idUsuario: 1, idLocal: 1 };

    this.orderService.creatyOrder(createReq).subscribe({
      next: () => this.router.navigate(['/orders']),
      error: () => this.snackBar.open('Error al crear la orden', 'Cerrar', {
        duration: 3000
      })
    });
  }

  private createDetalleFormGroup(result: any): FormGroup {
    return this._formBuilder.group({
      servicio: [result.servicioNombre],
      estado: [result.estado],
      comentario: [result.comentario],
      fechaEntrega: [result.fechaEntrega],
      valor: [result.valor],
      descuento: [0]
    });
  }

  private mapEstado(estado: string): string {
    switch (estado) {
      case 'R':
        return 'Recibido';
      case 'EP':
        return 'En Proceso';
      case 'C':
        return 'Completo';
      case 'E':
        return 'Entregado';
      default:
        return estado;
    }
  }
}
function result(value: any): void {
  throw new Error('Function not implemented.');
}

