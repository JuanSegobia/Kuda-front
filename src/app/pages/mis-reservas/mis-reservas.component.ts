import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ReservaActual, ReservasService } from '../../services/reservas.service';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mis-reservas.component.html',
  styleUrl: './mis-reservas.component.css',
})
export class MisReservasComponent implements OnInit {
  @ViewChild('detalleDialog') detalleDialog?: ElementRef<HTMLDialogElement>;

  reservas: ReservaActual[] = [];
  isLoading = true;
  errorMsg = '';
  reservaSeleccionada: ReservaActual | null = null;

  constructor(private readonly reservasService: ReservasService) {}

  ngOnInit(): void {
    this.reservasService.getMisReservas().subscribe({
      next: (data) => {
        this.reservas = data ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.errorMsg = 'No pudimos cargar tus reservas. Intentá nuevamente más tarde.';
        this.isLoading = false;
      },
    });
  }

  verDetalle(reserva: ReservaActual): void {
    // La HU pide que exista el botón "Ver detalle". El detalle completo pertenece
    // al módulo Reservas, así que acá mostramos un resumen visual del registro.
    this.reservaSeleccionada = reserva;
    this.detalleDialog?.nativeElement.showModal();
  }

  cerrarDetalle(): void {
    this.detalleDialog?.nativeElement.close();
    this.reservaSeleccionada = null;
  }

  modalidadLabel(modalidad: ReservaActual['modalidad']): string {
    return modalidad === 'ABONADO' ? 'Abonado' : 'Clase individual';
  }
}
