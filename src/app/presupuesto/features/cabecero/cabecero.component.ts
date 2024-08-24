import { Router } from '@angular/router';
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
import { StorageBudgetService } from '../../data-access/storage.service';


@Component({
  selector: 'app-cabecero',
  standalone: true,
  templateUrl: './cabecero.component.html', // <app-cabecero></app
  styleUrl: './cabecero.component.css',
  imports: [FormularioComponent, GastoComponent, IngresoComponent, CommonModule]
})
export class CabeceroComponent implements OnInit {
  personService = inject(PersonService);
  budgetService = inject(BudgetService);
  budgetStorageService = inject(StorageBudgetService);

  budgetId!: string;
  personId!: string;
  person!: Signal<Person | undefined>;
  budget!: Signal<Budget | undefined>;
  percent!: number;
  budgetStorage: Budget = new Budget();


  constructor(private router: Router) {
    this.budgetService.getBudgets();
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.queryParams) {
      this.budgetId = navigation?.extras.queryParams['budgetId'];
      this.personId = navigation?.extras.queryParams['personId'];
    }
    this.person = toSignal(this.personService.getPerson(Number(this.personId)));
    this.budget = toSignal(this.budgetService.getBudget(Number(this.budgetId)));
    if (this.budget()?.budgetId) {
      this.budgetStorageService.storageBudget(this.budget()!)
    }
    this.percent = (this.budget()?.totalIncomes! / this.budget()?.totalExpenses!)

    if (this.budget()?.budgetId === null || this.budget()?.budgetId === undefined) {
      this.budget = toSignal(this.budgetStorageService.getBudgetStorage());
    }

  }
  ngOnInit(): void {
  }

}
