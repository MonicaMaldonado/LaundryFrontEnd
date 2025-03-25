import { Component, Inject, inject, OnInit } from '@angular/core';

export interface DialogData {
  // Define the properties of DialogData here
  servicio: string ;
  
  estado: string;
  servicioDes: string;
  comentario: string;
  fechaEntrega: string;
  valor: number;
  descuento: string;
}
import { ServicesService } from '../../services.service';
import { CommonModule } from '@angular/common';
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

  formData?: OrderDetalle;
  services : Service[] = [];


  servicio : string | undefined;
  servicioNombre : string | undefined;
  estado : string | undefined;
  comentario : string | undefined;
  fechaEntrega: Date | undefined;;
  valor: number | undefined;;
  descuento: string | undefined;;


  selectedDate?: moment.Moment = moment(new Date());

  private _formBuilder = inject(FormBuilder);
  private serviceService = inject(ServicesService);
  private router = inject(Router);
  //private dialogRef = inject(MatDialogRef<OrderItemComponent>);
  private snackBar = inject(MatSnackBar);
form: FormGroup<any>;



  // form : FormGroup;

  constructor(public dialogRef : MatDialogRef<OrderItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private OrderService : OrderService
  ){
       this.form = this._formBuilder.group({
      servicio: ['', Validators.required],
      estado: ['', Validators.required],
      comentario: [''],
      fechaEntrega: ['', Validators.required],
      valor: [0, Validators.required],
      descuento: [0]
      }); 
}
  

selected(event: MatSelectChange) {
  this.servicioNombre = (event.source.selected as MatOption).viewValue;
  console.log((event.source.selected as MatOption).viewValue);
  
}



  

   

   ngOnInit(): void {
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
      id: serv.id.toString(),
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
    this.OrderService.orderItems.push(this.form.value);
      this.dialogRef.close(this.OrderService.orderItems);
    console.log("Wdfasdfadsf");

    console.log(this.servicioNombre);
  
  

    //let dataYouWantToReturn = this.form.value.comentario;
    

    this.dialogRef.close({
      servicio: this.servicio,
      servicioNombre: this.servicioNombre,
      estado: this.estado,
      fechaEntrega: this.fechaEntrega,
      valor: this.valor,
      descuento: this.descuento,
      comentario: this.comentario
    });


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

