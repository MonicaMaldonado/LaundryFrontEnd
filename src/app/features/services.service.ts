import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Service } from '../models/service.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private apiUrl = `${environment.apiUrl}`;

  constructor(private http : HttpClient) { }

  getServicios()
    : Observable<Service[]> {
      return this.http.get<Service[]>(`${this.apiUrl}/api/servicios`);

  }

  getServicioById(id : string) 
    :Observable<Service> {
      return this.http.get<Service>(`${this.apiUrl}/api/servicio/${id}`);
    }
}