import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export type ModalidadReserva = 'ABONADO' | 'INDIVIDUAL';
export type EstadoReserva = 'VIGENTE' | 'EN_GRACIA';

export interface ReservaActual {
  id: number;
  actividad: string;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  modalidad: ModalidadReserva;
  proximaFecha?: string;
  estado: EstadoReserva;
}

@Injectable({ providedIn: 'root' })
export class ReservasService {
  /**
   * MOCK (Regla de Oro 1): el back no expone `GET /api/reservas` para el cliente.
   * Para probar el escenario "Listado vacío" de la HU, cambiar a `[]`.
   */
  private readonly RESERVAS_MOCK: ReservaActual[] = [
    {
      id: 1,
      actividad: 'Yoga',
      diaSemana: 'Lunes',
      horaInicio: '09:00',
      horaFin: '10:00',
      modalidad: 'ABONADO',
      estado: 'VIGENTE',
    },
    {
      id: 2,
      actividad: 'Funcional',
      diaSemana: 'Miércoles',
      horaInicio: '18:30',
      horaFin: '19:30',
      modalidad: 'ABONADO',
      estado: 'VIGENTE',
    },
    {
      id: 3,
      actividad: 'Pilates',
      diaSemana: 'Sábado',
      horaInicio: '10:00',
      horaFin: '11:00',
      modalidad: 'INDIVIDUAL',
      proximaFecha: '2026-05-23',
      estado: 'VIGENTE',
    },
  ];

  getMisReservas(): Observable<ReservaActual[]> {
    return of(this.RESERVAS_MOCK).pipe(delay(400));
  }
}
