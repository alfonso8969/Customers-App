import { Router, RouterModule } from '@angular/router';
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
import { StoragePersonService } from '../../../persons/data-access/storage.service';
import { of } from 'rxjs';
import { Income } from '../../../class/ingreso.model';


@Component({
  selector: 'app-cabecero',
  standalone: true,
  templateUrl: './cabecero.component.html', // <app-cabecero></app
  styleUrl: './cabecero.component.css',
  imports: [FormularioComponent, GastoComponent, IngresoComponent, CommonModule, RouterModule]
})
export class CabeceroComponent implements OnInit {
  personService = inject(PersonService);
  budgetService = inject(BudgetService);

  budgetId!: string;
  personId!: string;
  person!: Signal<Person | undefined>;
  percent!: number;
  budget: Budget = new Budget();


  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.queryParams) {
      this.budgetId = navigation?.extras.queryParams['budgetId'];
      this.personId = navigation?.extras.queryParams['personId'];
      this.person = toSignal(this.personService.getPerson(Number(this.personId)));
      this.budgetService.getBudget(Number(this.budgetId))
        .subscribe(budget => {
          this.budget = budget!;
          if (budget!.incomes === undefined) {
            this.budget.incomes = new Array<Income>();
          }
          if (budget!.expenses === undefined) {
            this.budget.expenses = new Array<Income>();
          }
          this.setPercent(budget);
          this.budgetService.setLocalBudget(this.budget);
        });
    }

    if (this.person === undefined) {
      this.person = toSignal(of(this.personService.getLocalPerson()));
    }

    if (this.budget.budgetId === undefined) {
      this.budget = JSON.parse(window.localStorage.getItem('budget')!);
      this.setPercent(this.budget);
    }

  }

  /**
   * Calculates and sets the percentage of total expenses to total incomes for a given budget.
   *
   * @param budget - The budget object for which the percentage needs to be calculated.
   * @returns {void} - The function does not return a value. It updates the `percent` property of the component.
   *
   * @remarks
   * This function is called when a budget is loaded or updated. It calculates the percentage of total expenses
   * to total incomes and updates the `percent` property of the component.
   *
   * @example
   * To calculate the percent that mean the total expenses for example 1.235€ of the a total incomes of 15368€
   * the percent es equal to at 100 * 1235 / 15368 = 8,036%.
   **/
  setPercent(budget: Budget): void {
    if (budget)
      this.percent = (100 * budget.totalExpenses!) / budget.totalIncomes!
  }

  ngOnInit(): void {
  }

}
