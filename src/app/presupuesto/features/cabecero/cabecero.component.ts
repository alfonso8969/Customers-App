import { Component } from '@angular/core';
import { FormularioComponent } from "../formulario/formulario.component";
import { GastoComponent } from "../gastos/gasto.component";
import { IngresoComponent } from "../ingreso/ingreso.component";

@Component({
  selector: 'app-cabecero',
  standalone: true,
  template: `
    <div class="cabecero">
      <div class="presupuesto">
          <div class="presupuesto_titulo">
              Presupuesto Disponible:
          </div>
          
          <div class="presupuesto_valor">+ 2,345.64</div>
          
          <div class="presupuesto_ingreso limpiarEstilos">
              <div class="presupuesto_ingreso--texto">Ingresos</div>
              <div class="right">
                  <div class="presupuesto_ingreso--valor">+ 4,300.00</div>
                  <div class="presupuesto_ingreso--porcentaje">&nbsp;</div>
              </div>
          </div>
          
          <div class="presupuesto_egreso limpiarEstilos">
              <div class="presupuesto_egreso--text">Gastos</div>
              <div class="right limpiarEstilos">
                  <div class="presupuesto_egreso--valor">- 1,954.36</div>
                  <div class="presupuesto_egreso--porcentaje">45%</div>
              </div>
          </div>
    </div>
    </div>
    <app-formulario />
    <div class="contenedor limpiarEstilos">
      <app-ingreso />
      <app-gasto />
    </div>
  `,
  styleUrl: './cabecero.component.css',
  imports: [FormularioComponent, GastoComponent, IngresoComponent]
})
export class CabeceroComponent {

}
