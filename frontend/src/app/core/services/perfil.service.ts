import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface Perfil {
  id?: number;
  usuario_id?: number;
  nombre: string;
  apellido: string;
  edad: number;
  correo: string;
  telefono: string;
  actualizado_en?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.obtenerToken()}`
    });
  }

  obtenerPerfil(): Observable<Perfil> {
    return this.http.get<Perfil>(`${this.apiUrl}/perfil`, {
      headers: this.getHeaders()
    });
  }

  crearPerfil(perfil: Perfil): Observable<any> {
    return this.http.post(`${this.apiUrl}/perfil`, perfil, {
      headers: this.getHeaders()
    });
  }

  actualizarPerfil(perfil: Perfil): Observable<any> {
    return this.http.put(`${this.apiUrl}/perfil`, perfil, {
      headers: this.getHeaders()
    });
  }
}