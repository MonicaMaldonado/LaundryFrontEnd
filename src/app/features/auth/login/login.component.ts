import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/interceptors/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OrderService } from '../../orders/order.service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatButtonModule, MatCardModule, MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  nombre = '';
  password = '';

  constructor(private authService: AuthService,
     private orderService : OrderService,
     private router: Router, private snackBar : MatSnackBar) { }

  onLogin() {
    this.authService.login({ username: this.nombre, password: this.password})
    .subscribe({
      next: () => this.router.navigate(['/clients']),
      error: (err) => //alert('Credenciales incorrectas'),
                      this.snackBar.open('Credenciales incorrectas.  Intentalo de nuevo.', 'Cerrar', {
                        duration: 3000
                      })
    });

    this.orderService.getLastOrderI().subscribe({
      next: (data) => {
        if (data) {
          localStorage.setItem('idOrder', data.toString());
        } else {
          localStorage.removeItem('idOrder');
        }
      },
      error: (err) => console.error(err)
    })

  }

}

