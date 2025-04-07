import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ServicesService } from '../../services.service';
import { Service } from '../../../models/service.model'; // Adjust the path as needed
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-service-list',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTableModule
  ],
  templateUrl: './service-list.component.html',
  styleUrl: './service-list.component.css'
})
export class ServiceListComponent implements OnInit {

  servicios = signal<Service[]>([]);
  displayedColumns : string[] = ['descripcion','costo','comentario','estado','local'];

  constructor(private servicesService: ServicesService) {}

  ngOnInit(): void {
    this.loadServices();
  }


  loadServices() {
    this.servicesService.getServicios()
      .subscribe((data) => {
        this.servicios.set(
          data.map((service : Service) => ({
            id: service.id,
            descripcion: service.descripcion,
            costo: service.costo,
            comentario: service.comentario,
            estado: service.estado,
            idLocal: service.idLocal,
            local: Number(service.idLocal) === 1 ? 'Alborada' : 'Other',
            promocion: service.promocion
          }))
        );
      })
  }

}

