import { Component, Input } from '@angular/core';
import { Budget } from '../../../class/budget.model';
import { Income } from '../../../class/ingreso.model';
import { BudgetService } from '../../data-access/budget.service';
import { Spent } from '../../../class/gasto.model';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { StorageBudgetService } from '../../data-access/storage.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-gasto',
  standalone: true,
  templateUrl: './gasto.component.html',
  styleUrl: './gasto.component.css',
  imports: [CommonModule, InputTextModule, ButtonModule]
})
export class GastoComponent {

  @Input() budgetId!: string;
  expenses: Spent[] = [];
  budget!: Budget;


  constructor(private budgetService: BudgetService, private storageBudgetService: StorageBudgetService) {

  }
  ngOnInit(): void {
    if(this.budgetId) {

      this.budgetService.getBudget(Number(this.budgetId)).subscribe((budget) => {
        if (budget) {
          this.budget = budget;
          this.expenses = budget.expenses || [];
        }
      });
    } else {
      this.storageBudgetService.getBudgetStorage().subscribe((budget) => {
        this.budget = budget;
      });

    }
  }


  deleteRecord(spent: Spent) {
    this.budgetService.deleteSpentOfBudget(
      Number(this.budgetId),
      this.expenses.indexOf(spent)
    ).subscribe(
      (updatedBudget) => {
        this.budget = new Budget(updatedBudget.budgetId);
        this.budget.expenses = updatedBudget.expenses;
        this.budget.incomes = updatedBudget.incomes;
        this.expenses = this.budget.expenses || [];
        this.budget.calculateTotalIncome();
        this.budget.calculateTotalExpenses();
        this.budget.calculateTotalBalance();
      }
    )
  }


}
