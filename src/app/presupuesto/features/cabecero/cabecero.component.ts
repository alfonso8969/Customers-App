import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { FormularioComponent } from "../formulario/formulario.component";
import { GastoComponent } from "../gastos/gasto.component";
import { IngresoComponent } from "../ingreso/ingreso.component";
import { Person } from '../../../class/person';
import { toSignal } from '@angular/core/rxjs-interop';
import { PersonService } from '../../../persons/data-access/person.service';
import { BudgetService } from '../../data-access/budget.service';
import { Budget } from '../../../class/budget.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-cabecero',
  standalone: true,
  templateUrl: './cabecero.component.html', // <app-cabecero></app
  styleUrl: './cabecero.component.css',
  imports: [FormularioComponent, GastoComponent, IngresoComponent, CommonModule]
})
export class CabeceroComponent implements OnInit{
  personService = inject(PersonService);
  budgetService = inject(BudgetService);

  budgetId!: string;
  personId!: string;
  person!: Signal<Person | undefined>;
  budget!: Signal<Budget | undefined>;
  percent!: number;

  constructor(private router: Router) {
    this.budgetService.getBudgets();
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.queryParams) {
      this.budgetId = navigation?.extras.queryParams['budgetId'];
      this.personId = navigation?.extras.queryParams['personId'];
    }
    this.person = toSignal(this.personService.getPerson(Number(this.personId)));
    this.budget = toSignal(this.budgetService.getBudget(Number(this.budgetId)));
    this.percent = (this.budget()?.totalIncomes! / this.budget()?.totalExpenses!)




  }
  ngOnInit(): void {
  }

}
