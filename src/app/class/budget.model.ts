import { Spent } from './gasto.model';
import { Income } from './ingreso.model';

export class Budget {
  public budgetId?: number | undefined;
  public incomes?: Income[] | undefined;
  public expenses?: Spent[] | undefined;
  public totalIncomes?: number | undefined;
  public totalExpenses?: number | undefined;
  public totalBalance?: number | undefined;


  constructor(budgetId?: number) {
    this.budgetId = budgetId;
    this.incomes = [];
    this.expenses = [];
  }

  calculateTotalIncome(): void {
    this.totalIncomes = this.incomes?.reduce(
      (acc, curr) => acc + curr.quantity,
      0
    );
  }

  calculateTotalExpenses() :void {
    this.totalExpenses = this.expenses?.reduce(
      (acc, curr) => acc + curr.quantity,
      0
    );
  }

  calculateTotalBalance():void  {
    this.totalBalance = this.totalIncomes! - this.totalExpenses!;
  }

}
