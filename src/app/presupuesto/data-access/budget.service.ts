import { inject, Signal } from "@angular/core";
import { Spent } from "../../class/gasto.model";
import { Income } from "../../class/ingreso.model";
import { Budget } from "../../class/budget.model";
import { StorageBudgetService } from "./storage.service";
import { map, Observable, of, Subscription } from "rxjs";
import Swal from "sweetalert2";
import { toSignal } from "@angular/core/rxjs-interop";

export class BudgetService {
  storage = inject(StorageBudgetService);

  budgets!: Signal<Budget[] | undefined>;
  budget: Budget = new Budget();

  constructor() {
    const budgetsObservable = this.storage.getBudgetsStorage();
    this.budgets = toSignal(budgetsObservable);

  }

  getBudgets(): Observable<Budget[]> {
    return this.storage.getBudgetsStorage();
  }

  getBudget(budgetId: number): Observable<Budget> {
    return this.storage.getBudgetStorage(budgetId);
  }

  addBudget(budget: Budget): Observable<Budget> {
    if (this.budgets()) {
      if (this.budgets()?.find(b => b.budgetId === budget.budgetId)?.budgetId !== undefined) {
        Swal.fire({
          icon: "info",
          title: "Añadir presupuesto",
          text: `El presupuesto nº ${budget.budgetId} ya existe`,
        })
        return of(new Budget());
      } else {
        this.budgets()?.push(budget);
        this.storage.storageBudgets(this.budgets()!);
        return of(budget);
      }
    } else {
      let budgets = new Array<Budget>();
      budgets.push(budget);
      this.storage.storageBudgets(budgets);
      this.storage.storageLocalBudget(budget);
      return of(budget);
    }
  }

  createUpdatedBudget(budget: Budget): Budget {
    const newBudget = new Budget(budget.budgetId);
    newBudget.incomes = budget.incomes;
    newBudget.expenses = budget.expenses;
    newBudget.calculateTotalIncome();
    newBudget.calculateTotalExpenses();
    newBudget.calculateTotalBalance();
    const index = this.budgets()?.findIndex(b => b.budgetId === budget.budgetId);

    if (index !== -1) {
      this.budgets()![index!] = newBudget;
    }

    this.storage.updateBudgetStorage(newBudget);
    this.storage.storageLocalBudget(newBudget);
    return newBudget;

  }

  deleteBudget(id: number): boolean {
    const index = this.budgets()?.findIndex(item => item.budgetId === id);
    if (index !== -1) {
      // Remove the item at the found index
      this.budgets()?.splice(index!, 1);
      this.storage.deleteBudgetStorage(id);
    }
    return index !== -1;
  }

  deleteIncomeOfBudget(budgetId: number, incomeIndex: number): Observable<Budget> {
    let budget = this.budgets()?.find(b => b.budgetId === budgetId)!;
    if (budget) {
      budget.incomes?.splice(incomeIndex, 1);
      budget = this.createUpdatedBudget(budget)
    } else {
      console.error(`Budget with id ${budgetId} not found.`);
      Swal.fire({
        title: 'Error',
        text: 'Could not delete income.',
        icon: 'error',
        confirmButtonText: 'Okay'
      })
    }  // Return the updated person to the caller.
    return of(budget!);
  }

  deleteSpentOfBudget(budgetId: number, spentIndex: number): Observable<Budget> {
    let budget = this.budgets()?.find(b => b.budgetId === budgetId)!;
    if (budget) {
      budget.expenses?.splice(spentIndex, 1);
      budget = this.createUpdatedBudget(budget)
    } else {
      console.error(`Budget with id ${budgetId} not found.`);
      Swal.fire({
        title: 'Error',
        text: 'Could not delete spent.',
        icon: 'error',
        confirmButtonText: 'Okay'
      })
    }  // Return the updated person to the caller.
    return of(budget!);
  }

  updateBudget(id: number, budget: any): Observable<Budget> {
    const index = this.budgets()?.findIndex(item => item.budgetId === id);
    if (index !== -1) {

      this.budgets()![index!] = this.createUpdatedBudget(budget);
      this.storage.storageBudgets(this.budgets()!);
    } else {
      console.error(`Budget with id ${id} not found.`);
      Swal.fire({
        title: 'Error',
        text: 'Could not update budget.',
        icon: 'error',
        confirmButtonText: 'Okay'
      })
    }  // Return the updated person to the caller.

    return of(budget);
  }

  addIncomeSpentToBudget(budget: Budget, option: string, income: Income | undefined, spent: Spent | undefined): Observable<Budget> {

    if (budget) {
      if (budget!.expenses === undefined) {
        budget.expenses = new Array<Income>();
      }

      if (budget!.incomes === undefined) {
        budget.incomes = new Array<Income>();
      }

      if (option === 'opInc') {
        budget.incomes?.push(income!);
      } else if (option === 'opSpe') {
        budget.expenses?.push(spent!);
      } else {
        console.error(`Invalid option: ${option}`);
        Swal.fire({
          title: 'Error',
          text: 'Invalid option for adding income or spent.',
          icon: 'error',
          confirmButtonText: 'Ok'
        })
      }
      budget = this.createUpdatedBudget(budget);
      return of(budget);
    } else {
      console.error(`Budget not found.`);
      Swal.fire({
        title: 'Error',
        text: `Could not add ${option = "opInc" ? "Income" : "Spent"}.`,
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return of(new Budget());
    }
  }
}
