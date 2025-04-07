import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/interceptors/auth.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  private authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }

  get userId() {
    return this.authService.getUserId();
  }

  get userName() {
    return this.authService.getUserName();
  }

  /* getUserName() {
    this.authService.getUserName();
  } */
}
