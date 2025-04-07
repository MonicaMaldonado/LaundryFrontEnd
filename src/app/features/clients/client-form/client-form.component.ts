import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientService } from '../client.service';
import { ClientRequestDto } from '../../../models/dtos/create-client-dto'; // Adjust the path as needed
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-client-form',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css'
})
export class ClientFormComponent {

  private _formBuilder = inject(FormBuilder);
  private clientService = inject(ClientService);
  private snackBar = inject(MatSnackBar);
  private route = inject(Router);
  form : FormGroup;

  constructor() {

    this.form = this._formBuilder.group({
      nombres: ['', Validators.required],
      apellidos: [''],
      telefono: [''],
      ruc: ['', Validators.maxLength(13)]
    });

  }

  saveClient() {
    if (this.form.invalid) {
      this.snackBar.open('Por favor complete los datos correspondientes', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    const clientData = this.form.value;
    const createClient : ClientRequestDto = { ...clientData,
      idUsuario: 1,
      idLocal: 1
    };

    this.clientService.createClient(createClient).subscribe({
      next: () => {

        this.snackBar.open('Cliente registrado exitosamente','Cerrar', {
          duration: 5000
        })
        this.route.navigate(['/clients']);
      },
      error: () => this.snackBar.open('Error al crear la orden', 'Cerrar', {
        duration: 3000
      })
    });

  }

}
