import { Injectable } from '@angular/core';
import { Budget } from '../../class/budget.model';

@Injectable()
export class StorageBudgetService {

  budgets: Budget[] = [];

  constructor() {
  }

  getBudgetStorage(): Budget[] {
    this.budgets = JSON.parse(localStorage?.getItem('budgets')!);
    return this.budgets ?? new Array<Budget>();
  }

  storageBudgets(budgets: Budget[]) {
    localStorage?.setItem('budgets', JSON.stringify(budgets));
  }

}
