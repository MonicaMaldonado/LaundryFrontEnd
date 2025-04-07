import { Component, Inject, inject, OnInit } from '@angular/core';

export interface DialogData {
  // Define the properties of DialogData here
  servicio: number ;

  estado: string;
  servicioNombre: string;
  comentario: string;
  fechaEntrega: string;
  valor: number;
  descuento: string;
}
import { ServicesService } from '../../services.service';
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Service } from '../../../models/service.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOption, provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import moment from 'moment';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { OrderDetalle } from '../../../models/dtos/orderdetalle.model';
import { NgForm} from '@angular/forms'
import { OrderService } from '../order.service.service';

@Component({
  selector: 'app-order-item',
  standalone: true,
  imports: [CommonModule,
     ReactiveFormsModule,
     MatFormFieldModule,
     MatInputModule,
     MatSelectModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDialogContent,
    MatButtonModule,
    MatSnackBarModule,
    MatTimepickerModule,
    FormsModule,
    ],
    providers: [provideNativeDateAdapter()],
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.css'
})
export class OrderItemComponent implements OnInit{


  // Removed invalid assignment. The initialization is already handled in ngOnInit.

  formData?: OrderDetalle;
  services : Service[] = [];
  servicioSeleccionado : number = 0;
  servicioId : number = 0;

  idServicio : number | undefined;
  servicioNombre : string | undefined;
  estado : string | undefined;
  comentario : string | undefined;
  fechaEntrega: Date | undefined;
  libras: number | undefined;
  prendas: number | undefined;
  valor: number | undefined;;
  descuento: string | undefined;;


  isShoesSelected: boolean = false;
  isPlanchadoSelected: boolean = false;

  private _formBuilder = inject(FormBuilder);
  private serviceService = inject(ServicesService);
  private router = inject(Router);
  //private dialogRef = inject(MatDialogRef<OrderItemComponent>);
  private snackBar = inject(MatSnackBar);
form: FormGroup<any>;

  selectedEstado: string = 'RE';

  // form : FormGroup;

  constructor(public dialogRef : MatDialogRef<OrderItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private OrderService : OrderService
  ){


       this.form = this._formBuilder.group({
      idServicio: [0],
      servicio: ['', Validators.required],
      estado: [''],
      comentario: [''],
      fechaEntrega: ['', Validators.required],
      libras:[0, Validators.required],
      parZapatos: [0],
      prendas: [0],
      valor: [0, Validators.required],
      descuento: [0]
      });

      this.form.get('servicio')
      ?.valueChanges.subscribe(valor =>  { this.servicioSeleccionado = valor;});


      this.form.setControl('estado', this._formBuilder.control(this.selectedEstado));
    }


  //   compareFn(estado1: "Recibido" | "Entregado" | "En Proceso", estado2: "Recibido" | "Entregado" | "En Proceso"): boolean {
  //     if (estado1 && estado2) {
  //      // return true;
  //      return estado1 === estado2;
  //   }
  //   return false;
  // }

  compareFn(o1: any, o2: any): boolean {
    return o1 === o2;
}

selected(event: MatSelectChange) {
  this.servicioNombre = (event.source.selected as MatOption).viewValue;
  this.servicioId = event.source.value;

  if (this.servicioNombre.toLowerCase().includes("zapatos")) {
    this.isShoesSelected = true;
    this.isPlanchadoSelected = false;
    this.form.get('prendas')?.setValue(0);
    this.form.get('libra')?.setValue(0);

    let fecha = new Date().getTime() + 48 * 60 * 60 * 1000; // Sumar dos día a la fecha actual
    let valor = formatDate(fecha, 'dd/MM/yyyy', 'en-US') ;
    this.form.get('fechaEntrega')?.setValue(new Date(valor));
    this.form.patchValue({ valor: 0 });
    //this.form.get('fechaEntrega')?.setValue(moment().add(2, 'days').toDate());
  }
  else if (this.servicioNombre.toLowerCase().includes("planchado")) {
    this.isShoesSelected = false
    this.isPlanchadoSelected = true;
    this.form.get('parZapatos')?.setValue(0);
    this.form.get('libra')?.setValue(0);

    let fecha = new Date().getTime() + 24 * 60 * 60 * 1000; // Sumar un día a la fecha actual
    let valor = formatDate(fecha, 'dd/MM/yyyy', 'en-US') ;
    this.form.get('fechaEntrega')?.setValue(new Date(valor));
    this.form.patchValue({ valor: 0 });
  }
  else {
    this.isShoesSelected = false;
    this.isPlanchadoSelected = false;
    this.form.get('parZapatos')?.setValue(0);
    this.form.get('prendas')?.setValue(0);
    this.form.patchValue({ valor: 0 });

    let fecha = new Date().getTime() + 24 * 60 * 60 * 1000; // Sumar un día a la fecha actual
    let valor = formatDate(fecha, 'dd/MM/yyyy', 'en-US') ;
    this.form.get('fechaEntrega')?.setValue(new Date(valor));
  }
  //this.form.setControl('idServicio', servicio)
  console.log((event.source.selected as MatOption).viewValue);

}

updateValue(event: Event): void
{
  let libras = parseFloat((event.target as HTMLInputElement).value) || 0;
  let valorServicio = 0;



  this.serviceService.getServicioById(this.servicioId)
    .subscribe(result => {
      valorServicio = result?.costo || 0; // Example logic to assign a value
      let valor = Math.round(((libras * valorServicio) + Number.EPSILON) *100) /100;

      if (valor < 1.75 && !this.isPlanchadoSelected && !this.isShoesSelected) {
        this.form.get('valor')?.setValue(1.75);
        return;
      }

      this.form.get('valor')?.setValue(valor);
      valor = 0;
    });
}







   ngOnInit(): void {


    this.form.controls['estado'].disable();

    this.formData = {
      idOrden: 0,
      idServicio: 0,
      estado: '',
      comentario: '',
      fechaEntrega: new Date(),
      valor: 0,
      descuento: 0
    }

    this.serviceService.getServicios()
    .subscribe(arg => this.services = arg.map(serv =>  ({
      ...serv,
      id: serv.id,
      idServicio: serv.id,

      servicioNombre: serv.descripcion,
      costo: Number(serv.costo)
    })));
  }



  cancel() {
    this.router.navigate(['/']);
  }

  public closeDialog(): void {
  let dataYouWantToReturn = true;
    let prueba = this.form.value.comentario;
    this.dialogRef.close(dataYouWantToReturn);
  }

  prueba(form: FormGroup) {


    //this.OrderService.orderItems.push(this.form.value);
    this.OrderService.orderItems = [];
    const arrayDetail = { ...this.form.value, idServicio : this.servicioId,
      servicioNombre : this.servicioNombre,
      estado: this.selectedEstado};

    this.OrderService.orderItems.push(arrayDetail);

    this.dialogRef.close(this.OrderService.orderItems);


    console.log("Wdfasdfadsf");

    console.log(this.servicioNombre);



    //let dataYouWantToReturn = this.form.value.comentario;

/*
    this.dialogRef.close({
      servicio: this.servicioId,
      servicioNombre: this.servicioNombre,
      estado: this.estado,
      fechaEntrega: this.fechaEntrega,
      valor: this.valor,
      descuento: this.descuento,
      comentario: this.comentario
    }); */


  }

  onNoClick(): void {
    this.dialogRef.close();
    let prueba = this.form.value.comentario;
    this.dialogRef.close(prueba);
    }

    onSubmit(){
      this.OrderService.orderItems.push(this.form.value);
      this.dialogRef.close();
    }
}

