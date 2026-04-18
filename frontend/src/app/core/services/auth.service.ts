import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  usuario: string;
  contrasena: string;
}

export interface LoginResponse {
  mensaje: string;
  token: string;
  usuario: {
    id: number;
    usuario: string;
    correo: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(credenciales: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credenciales).pipe(
      tap((respuesta) => {
        localStorage.setItem('token', respuesta.token);
        localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  estaAutenticado(): boolean {
    return !!localStorage.getItem('token');
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  obtenerUsuario(): any {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }
}