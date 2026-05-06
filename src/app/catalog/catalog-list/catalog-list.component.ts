import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Plan } from '../../models/plan.model';
import { PlanService } from '../../services/plan.service';
import { PagoService } from '../../services/pago.service';

@Component({
  selector: 'app-catalog-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalog-list.component.html',
  styleUrls: ['./catalog-list.component.css'],
})
export class CatalogListComponent implements OnInit {
  planes: Plan[] = [];
  pagoError = '';

  constructor(
    private readonly planService: PlanService,
    private readonly pagoService: PagoService
  ) {
  }

  ngOnInit(): void {
    this.planService.getPlanes().subscribe({
      next: (data) => {
        this.planes = data;
      },
      error: () => {
        this.planes = [];
      },
    });
  }

  pagarPlan(plan: Plan): void {
    this.pagoError = '';
    this.pagoService
      .createPreference({
        tituloPlan: plan.nombre,
        precio: Number(plan.precio),
      })
      .subscribe({
        next: (response) => {
          if (response?.init_point) {
            window.location.href = response.init_point;
          }
        },
        error: () => {
          this.pagoError = 'No se pudo iniciar el pago en este momento.';
        },
      });
  }
}
