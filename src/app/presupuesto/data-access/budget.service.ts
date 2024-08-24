import { inject } from "@angular/core";
import { Spent } from "../../class/gasto.model";
import { Income } from "../../class/ingreso.model";
import { Budget } from "../../class/budget.model";
import { StorageBudgetService } from "./storage.service";
import { Observable, of } from "rxjs";
import Swal from "sweetalert2";

export class BudgetService {
  storage = inject(StorageBudgetService);

  private newBudget!: Budget;
  private createdUpdatedBudget!: Budget;
  private incomeBudget!: Income[];
  private expenseBudget!: Spent[];

  budgets_mock: Budget[] = [];

  budget1: Budget = new Budget(1);
  budget2: Budget = new Budget(2);

  expense1Budget1: Spent = new Spent(
    'Gasto en comida',
    200,
    new Date()
  );

  expense2Budget1: Spent = new Spent(
    'Gasto ropa',
    100,
    new Date()
  );

  expense1Budget2: Spent = new Spent(
    'Gasto en luz',
    120,
    new Date()
  );

  expense2Budget2: Spent = new Spent(
    'Gasto en agua',
    50,
    new Date()
  );


  income1Budget1: Income = new Spent(
    'Salario',
    4000,
    new Date()
  );

  income2Budget1: Income = new Spent(
    'Venta coche',
    1000,
    new Date()
  );


  income1Budget2: Income = new Spent(
    'Salario',
    2500,
    new Date()
  );

  income2Budget2: Income = new Spent(
    'Venta guitarra',
    250,
    new Date()
  );




  constructor() {
    this.budget1.incomes?.push(this.income1Budget1, this.income2Budget1);
    this.budget1.expenses?.push(this.expense1Budget1, this.expense2Budget1);
    this.budget1.calculateTotalIncome();
    this.budget1.calculateTotalExpenses();
    this.budget1.calculateTotalBalance();
    this.budget2.incomes?.push(this.income1Budget2, this.income2Budget2);
    this.budget2.expenses?.push(this.expense1Budget2, this.expense2Budget2);
    this.budget2.calculateTotalIncome();
    this.budget2.calculateTotalExpenses();
    this.budget2.calculateTotalBalance();

    this.budgets_mock.push(this.budget1, this.budget2);
    this.createBudget();
  }

  createBudget() {
    this.newBudget = new Budget();
    this.newBudget.incomes = this.incomeBudget;
    this.newBudget.expenses = this.expenseBudget;
  }

  getBudgets(): Observable<Budget[]> {
    let budgets = this.storage.getBudgetsStorage();
    if (budgets.length !== 0) {
      return of(budgets);
    }
    this.storage.storageBudgets(this.budgets_mock);
    return of(this.budgets_mock);
  }

  getBudget(budgetId: number): Observable<Budget | undefined> {
    this.budgets_mock = this.storage.getBudgetsStorage();
    let budget = this.budgets_mock.find(b => b.budgetId === budgetId);
    return of(budget);
  }

  addBudget(budget: any): Observable<Budget> {
    this.budgets_mock = this.storage.getBudgetsStorage();
    this.budgets_mock.push(this.createUpdatedBudget(budget));
    this.storage.storageBudgets(this.budgets_mock);
    return of(budget);
  }

  createUpdatedBudget(budget: Budget): Budget {
    const newBudget = new Budget(budget.budgetId);
    newBudget.incomes = budget.incomes;
    newBudget.expenses = budget.expenses;
    newBudget.calculateTotalIncome();
    newBudget.calculateTotalExpenses();
    newBudget.calculateTotalBalance();
    return newBudget;

  }

  deleteBudget(id: number): boolean {
    this.budgets_mock = this.storage.getBudgetsStorage();
    const index = this.budgets_mock.findIndex(item => item.budgetId === id);

    if (index !== -1) {
      // Remove the item at the found index
      this.budgets_mock.splice(index, 1);
    }
    this.storage.storageBudgets(this.budgets_mock);
    return index !== -1;
  }

  deleteIncomeOfBudget(budgetId: number, incomeIndex: number): Observable<Budget> {
    this.budgets_mock = this.storage.getBudgetsStorage();
    let budget = this.budgets_mock.find(b => b.budgetId === budgetId)!;
    if (budget) {
      budget.incomes?.splice(incomeIndex, 1);
      this.storage.storageBudgets(this.budgets_mock);
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
    this.budgets_mock = this.storage.getBudgetsStorage();
    const budget = this.budgets_mock.find(b => b.budgetId === budgetId);
    if (budget) {
      budget.expenses?.splice(spentIndex, 1);
      this.storage.storageBudgets(this.budgets_mock);
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
    this.budgets_mock = this.storage.getBudgetsStorage();
    const index = this.budgets_mock.findIndex(item => item.budgetId === id);
    if (index !== -1) {

      this.budgets_mock[index] = this.createUpdatedBudget(budget);
      this.storage.storageBudgets(this.budgets_mock);
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

}
