import { CommonModule, formatDate } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
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
import { FormatCodeSettings } from 'typescript';
import { AuthService } from '../../../core/interceptors/auth.service';
import { MatTimepickerModule } from '@angular/material/timepicker';
// Add your imports here
import { MatTimepicker } from '@angular/material/timepicker';
import { ViewChild } from '@angular/core';
import { NgModule } from '@angular/core';

export interface orderDetalle {
  servicio: number;
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
    MatIconModule,
    MatTimepickerModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.css',
})
export class OrderFormComponent implements OnInit  {
  ordenDetalles : orderDetalle[] = [];
  formControl: FormControl<Date | null> = new FormControl(null);

  private dialog = inject(MatDialog);
  private clientService = inject(ClientService);
  private _formBuilder = inject(FormBuilder);
  private orderService = inject(OrderService);
  private serviceService = inject(ServicesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);

  deshabilitar!: FormControl;
  clientes : clientes[] = [];
  services : Service[] = [];
  clienteSeleccionado : number = 0;
  detalleArrays: FormArray[] = [];
  conteoRegistro : number = 0;
  sumaTotal : number = 0;
  planchado: boolean = false;

  form : FormGroup;
  orderId : string | null;
  isEditMode = signal(false);
  lastOrderId: number = 0;

  constructor(public changeDetectorRef: ChangeDetectorRef) {
    this.ordenDetalles= [];


    this.form = this._formBuilder.group({
      cliente: ['', Validators.required],
      //estado: ['', Validators.required],
      fechaRecepcion: [''],
   //   hora: [''],
      //fechaEntrega: ['', Validators.required],
      valor: [0],
      comentario: [''],
      detalles: this._formBuilder.array([
        this._formBuilder.group({
          id: [0],
          idServicio: [0],
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
        this.conteoRegistro ++;
        result.id = this.conteoRegistro ;
        detalleArray.push(this.createDetalleFormGroup(result[0], this.conteoRegistro));

        this.detalleArrays.push(detalleArray);
        this.form.setControl('detalles', this._formBuilder.array(this.detalleArrays.flatMap(array => array.controls)));

        this.ordenDetalles.push({
          servicioNombre: result[0].servicioNombre,
          servicio: result[0].servicio,
          estado:'Recibido',// this.mapEstado(result.estado),
          comentario: result[0].comentario,
          fechaEntrega: new Date(result[0].fechaEntrega).toISOString().substring(0,10),
          valor: result[0].valor
        });
      }
    });
  }

  setCliente(value : any)
  {
    this.clienteSeleccionado = value;
  }

  ngOnInit(): void {

    this.getLastOrderId();
    let fecha = new Date();

    let valor = formatDate(fecha, 'dd/MM/yyyy', 'en-US') ;
    this.form.patchValue({ fechaRecepcion:  new Date(valor) });

    this._formBuilder.control('fechaRecepcion').disable();
    this.deshabilitar = new FormControl({value:new Date(valor), disabled: true});

    const initialValue = new Date();
    initialValue.setTime(13 * 60 * 60 * 1000); // Set to 08:00 AM
    this.formControl = new FormControl(initialValue);

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


  getLastOrderId() {
    this.lastOrderId = parseInt(localStorage.getItem('idOrder') || '0');
    console.log(this.lastOrderId);  }


  loadOrder(orderId: string) {
    this.orderService.getOrderByIdF(orderId)
      .subscribe((order) => {
        this.form.patchValue(order);
      });
  }

  saveOrder() {



    const detalleControl = this.form.get('detalles') as FormArray;
    detalleControl.controls.forEach((control) => {
      const servicioNombre = control.get('servicio')?.value;
      this.planchado = true;
    });

    if (!this.planchado) {
      if (this.sumaTotal < 1.75) {
        this.snackBar.open('El valor total debe ser igual o mayor a 1.75', 'Cerrar', {
          duration: 3000
        });
        return;
      }
    }

    if (this.form.invalid) {
      this.snackBar.open('Por favor completa los campos correctamente', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    const prr  = this.form.get('hora')?.value;

    const hora = this.formControl.value ? this.formControl.value.getHours() : 0;
    const minutos = this.formControl.value ? this.formControl.value.getMinutes() : 0;
    const segundos = this.formControl.value ? this.formControl.value.getSeconds() : 0;
    const fecha = this.form.get('fechaRecepcion')?.value;
    const fechaRecepcion = new Date(fecha);
    fechaRecepcion.setHours(hora, minutos, segundos, 0);


    const idUsuario = this.authService.getUserId();
    const orderData = this.form.value;
   // const idServicio = this.form.controls("cliente")
   /*  const detalleControl = this.form.get('detalle');
    if (detalleControl) {
      this.form.setControl('detalle', this._formBuilder.array(detalleControl.value));
    } */

    const createReq: CreateOrderRequestDto = { ...orderData,
      estado: 'R',
      idUsuario: idUsuario,
      idLocal: 1,
      idCliente: this.clienteSeleccionado,
      fechaRecepcion: fechaRecepcion
    };

    this.orderService.creatyOrder(createReq).subscribe({
      next: () => {

         this.orderService.getLastOrderI().subscribe({
          next: (data) => {
            if (data) {
              localStorage.setItem('idOrder', data.toString());
            } else {
              localStorage.removeItem('idOrder');
            }
          }
        });

         this.router.navigate(['/order']);
         this.snackBar.open('Orden guardada', 'Cerrar', {
            duration:3000
         })
      },
      error: () => this.snackBar.open('Error al crear la orden', 'Cerrar', {
        duration: 3000
      })
    });
  }

  private createDetalleFormGroup(result: any, conteoRegistro: number): FormGroup {

    this.sumaTotal += result.valor;
    this.form.patchValue({ valor: this.sumaTotal });

    return this._formBuilder.group({
      id: [conteoRegistro],
      idServicio: [result.servicio],
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


