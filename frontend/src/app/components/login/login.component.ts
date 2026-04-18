import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario: string = '';
  contrasena: string = '';
  mensajeError: string = '';
  cargando: boolean = false;
  mostrarContrasena: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.mensajeError = '';

    if (!this.usuario.trim() || !this.contrasena.trim()) {
      this.mensajeError = 'Todos los campos son obligatorios.';
      return;
    }

    this.cargando = true;

    this.authService.login({ usuario: this.usuario, contrasena: this.contrasena }).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/dashboard/perfil']);
      },
      error: (err) => {
        this.cargando = false;
        if (err.status === 401) {
          this.mensajeError = 'Credenciales incorrectas';
        } else {
          this.mensajeError = 'Error al conectar con el servidor. Intente de nuevo.';
        }
      }
    });
  }

  toggleMostrarContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }
}