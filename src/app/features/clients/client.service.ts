import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment} from '../../../environments/environment';
import { Client } from '../../models/client.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl = `${environment.apiUrl}`;

  constructor(private http : HttpClient) { }

/*   getClients(
    query:string, 
    page:number = 1,
    limit: number = 10) 
    :  Observable<Client[]> {
      return this.http.get<Client[]>(`${this.apiUrl}/api/clients?${query}&page=${page}&limit=${limit}`);
  } */

  getClients() 
    :  Observable<Client[]> {
      return this.http.get<Client[]>(`${this.apiUrl}/api/clients`);
  }
}
