import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService, CurrentUser } from '../../services/auth.service';

@Component({
  selector: 'app-mi-informacion',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mi-informacion.component.html',
  styleUrl: './mi-informacion.component.css',
})
export class MiInformacionComponent implements OnInit {
  usuario: CurrentUser | null = null;

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.usuario = this.auth.getCurrentUser();
    if (!this.usuario) void this.router.navigateByUrl('/login');
  }
}
