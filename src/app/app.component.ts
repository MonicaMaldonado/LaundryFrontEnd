import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCard, MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, MatCardModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'LaundryFrontEnd';
}
