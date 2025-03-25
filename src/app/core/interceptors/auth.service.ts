import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface AuthResponse {
  token: string;
  fullname: string;
  userRole: string;

}


@Injectable({
  providedIn: 'root'
})
export class AuthService implements HttpInterceptor {

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  constructor() { }

  login(credentials : { 
    username : string; 
    password: string;
  }) : Observable<AuthResponse> 
  {
      return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/login`, credentials)
      .pipe(
        tap((response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('fullName', response.fullname);
          localStorage.setItem('userRole', response.userRole);
        }))
      );
  }

  logout() : void {

    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
  }

  getUserRole() : string | null {
    return localStorage.getItem('userRole');
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {

      const token = localStorage.getItem('token');
      const cloneReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        },
      });

      return next.handle(cloneReq);
  }
}
