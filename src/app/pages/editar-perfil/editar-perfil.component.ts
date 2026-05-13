import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './editar-perfil.component.html',
  styleUrl: './editar-perfil.component.css',
})
export class EditarPerfilComponent implements OnInit {
  readonly form = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    apellido: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    telefono: new FormControl('', { nonNullable: true }),
  });

  isSubmitting = false;
  submitError = '';
  successMessage = '';

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const usuario = this.auth.getCurrentUser();
    if (!usuario) { void this.router.navigateByUrl('/login'); return; }

    this.form.setValue({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      telefono: usuario.telefono ?? '',
    });
  }

  onSubmit(): void {
    this.submitError = '';
    this.successMessage = '';
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.isSubmitting = true;
    const { nombre, apellido, telefono } = this.form.controls;

    this.auth.actualizarPerfil({
      nombre: nombre.value.trim(),
      apellido: apellido.value.trim(),
      telefono: telefono.value.trim() || undefined,
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Tus datos fueron actualizados correctamente.';
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitError = err?.error?.message ?? 'No se pudieron guardar los cambios. Intentá nuevamente.';
      },
    });
  }
}
