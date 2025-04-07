import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

interface AuthResponse {
  token: string;
  fullName: string;
  userRole: string;
  id: number;

}


@Injectable({
  providedIn: 'root'
})
export class AuthService implements HttpInterceptor {

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private router = inject(Router);
  //private authService = inject(AuthService);

  //userName = computed(() => this.authService.getUserName());

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
          localStorage.setItem('fullName', response.fullName);
          localStorage.setItem('userRole', response.userRole);
          localStorage.setItem('idUser', response.id.toString())
        }))
      );
  }

  logout() : void {

    localStorage.removeItem('token');
    localStorage.removeItem('fullName');

    this.router.navigate(['login']);
  }

  getUserRole() : string | null {
    return localStorage.getItem('userRole');
  }

  getUserName() : string | null{
    return localStorage.getItem('fullName');
  }

  getUserId() : number | null {
    const id = localStorage.getItem('idUser');
    return id !== null ? parseInt(id, 10) : null;
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
