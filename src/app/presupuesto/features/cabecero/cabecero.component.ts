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
import { StoragePersonService } from '../../../persons/data-access/storage.service';
import { of } from 'rxjs';
import { Income } from '../../../class/ingreso.model';


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
  personStorageService = inject(StoragePersonService);
  budgetStorageService = inject(StorageBudgetService);

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
          this.percent = (100 * this.budget.totalExpenses!) / this.budget.totalIncomes!
          this.budgetStorageService.storageLocalBudget(this.budget);
        }
        );
    }

    if (this.person === undefined) {
      this.person = toSignal(this.personStorageService.getPersonStorage());
    }

    if(this.budget.budgetId === undefined) {
      this.budget = JSON.parse(window.localStorage.getItem('budget')!);
    }

  }
  ngOnInit(): void {
  }

}
