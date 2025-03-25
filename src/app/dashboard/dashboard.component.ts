import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../core/interceptors/auth.service';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatListModule, MatToolbarModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  userRole: string | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
  }

  logout() {
    this.authService.logout();
    window.location.reload();
  }  

}
