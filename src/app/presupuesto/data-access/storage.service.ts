import { Injectable } from '@angular/core';
import { Budget } from '../../class/budget.model';
import { Observable, of } from 'rxjs';

@Injectable()
export class StorageBudgetService {

  budgets: Budget[] = [];
  budget!: Budget;

  constructor() {
  }

  getBudgetsStorage(): Budget[] {
    this.budgets = JSON.parse(localStorage?.getItem('budgets')!);
    return this.budgets ?? new Array<Budget>();
  }

  storageBudgets(budgets: Budget[]) {
    localStorage?.setItem('budgets', JSON.stringify(budgets));
  }

  getBudgetStorage(): Observable<Budget> {
    if(localStorage?.getItem('budget') !== "undefined") {
      this.budget = JSON.parse(localStorage?.getItem('budget')!);
      return of(this.budget);
    }

    return of(new Budget());
  }

  storageBudget(budget: Budget) {
    localStorage?.setItem('budget', JSON.stringify(budget));
  }

}
