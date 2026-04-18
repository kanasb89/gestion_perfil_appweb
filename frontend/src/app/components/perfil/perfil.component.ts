import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerfilService, Perfil } from '../../core/services/perfil.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  perfil: Perfil = {
    nombre: '',
    apellido: '',
    edad: 0,
    correo: '',
    telefono: ''
  };

  tienePerfilGuardado: boolean = false;
  cargando: boolean = false;
  cargandoDatos: boolean = true;
  mensajeExito: string = '';
  mensajeError: string = '';
  erroresCampos: { [key: string]: string } = {};

  constructor(private perfilService: PerfilService) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.cargandoDatos = true;
    this.perfilService.obtenerPerfil().subscribe({
      next: (datos) => {
        this.perfil = datos;
        this.tienePerfilGuardado = true;
        this.cargandoDatos = false;
      },
      error: (err) => {
        if (err.status === 404) {
          this.tienePerfilGuardado = false;
        }
        this.cargandoDatos = false;
      }
    });
  }

  validarFormulario(): boolean {
    this.erroresCampos = {};
    let esValido = true;

    if (!this.perfil.nombre?.trim()) {
      this.erroresCampos['nombre'] = 'El nombre es obligatorio.';
      esValido = false;
    }

    if (!this.perfil.apellido?.trim()) {
      this.erroresCampos['apellido'] = 'El apellido es obligatorio.';
      esValido = false;
    }

    if (!this.perfil.edad || isNaN(+this.perfil.edad) || +this.perfil.edad <= 0 || +this.perfil.edad >= 120) {
      this.erroresCampos['edad'] = 'Ingresa una edad válida (1-119).';
      esValido = false;
    }

    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.perfil.correo?.trim() || !correoRegex.test(this.perfil.correo)) {
      this.erroresCampos['correo'] = 'Ingresa un correo electrónico válido.';
      esValido = false;
    }

    if (!this.perfil.telefono?.trim() || !/^\d{8}$/.test(this.perfil.telefono)) {
      this.erroresCampos['telefono'] = 'El teléfono debe tener exactamente 8 dígitos.';
      esValido = false;
    }

    return esValido;
  }

  guardarPerfil(): void {
    this.mensajeExito = '';
    this.mensajeError = '';

    if (!this.validarFormulario()) {
      return;
    }

    this.cargando = true;

    const operacion = this.tienePerfilGuardado
      ? this.perfilService.actualizarPerfil(this.perfil)
      : this.perfilService.crearPerfil(this.perfil);

    operacion.subscribe({
      next: (resp) => {
        this.cargando = false;
        this.tienePerfilGuardado = true;
        this.mensajeExito = this.tienePerfilGuardado
          ? resp.mensaje || 'Perfil actualizado exitosamente.'
          : resp.mensaje || 'Perfil creado exitosamente.';

        if (resp.perfil) {
          this.perfil = { ...this.perfil, ...resp.perfil };
        }

        setTimeout(() => { this.mensajeExito = ''; }, 4000);
      },
      error: (err) => {
        this.cargando = false;
        this.mensajeError = err.error?.mensaje || 'Error al guardar el perfil. Intente de nuevo.';
      }
    });
  }
}