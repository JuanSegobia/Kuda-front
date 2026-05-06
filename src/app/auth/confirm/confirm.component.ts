import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.css',
})
export class ConfirmComponent implements OnInit {
  isLoading = true;
  message = '';
  isError = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly auth: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    if (!token) {
      this.isLoading = false;
      this.isError = true;
      this.message = 'Falta el token de confirmación.';
      return;
    }

    this.auth.confirmarCuenta(token).subscribe({
      next: (resp) => {
        this.isLoading = false;
        this.isError = false;
        this.message = resp?.message ?? 'Cuenta confirmada correctamente.';
      },
      error: (err) => {
        this.isLoading = false;
        this.isError = true;
        this.message =
          err?.error?.message ??
          'No se pudo confirmar la cuenta. El enlace puede haber expirado.';
      },
    });
  }
}

