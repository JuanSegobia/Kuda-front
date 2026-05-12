export interface Plan {
  id: number;
  nombre: string;
  actividad_id: number;
  tipo: 'MENSUAL' | 'INDIVIDUAL';
  precio?: number;
  duracion_dias?: number;
  activo: boolean;
  actividad?: { id: number; nombre: string };
}
