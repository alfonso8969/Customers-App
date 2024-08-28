import { Component, Input, OnInit } from '@angular/core';
import { Income } from '../../../class/ingreso.model';
import { BudgetService } from '../../data-access/budget.service';
import { CommonModule } from '@angular/common';
import { Budget } from '../../../class/budget.model';
import { StorageBudgetService } from '../../data-access/storage.service';

@Component({
  selector: 'app-ingreso',
  standalone: true,
  templateUrl: './ingreso.component.html',
  styleUrl: './ingreso.component.css',
  imports: [CommonModule]
})
export class IngresoComponent implements OnInit {

  incomes: Income[] = [];
  budget!: Budget;

  constructor(private budgetService: BudgetService,
              private storageBudgetService: StorageBudgetService) {

  }
  ngOnInit(): void {
    this.storageBudgetService.getBudgetStorage().subscribe((budget) => {
      this.budget = budget;
      this.incomes = budget.incomes || [];
    });
  }

  deleteRecord(income: Income) {
    this.budgetService.deleteIncomeOfBudget(
      Number(this.budget.budgetId),
      this.incomes.indexOf(income)
    ).subscribe(
      (updatedBudget) => {
        this.budget = new Budget(updatedBudget.budgetId);
        this.budget.incomes = updatedBudget.incomes;
        this.budget.expenses = updatedBudget.expenses;
        this.incomes = this.budget.incomes || [];
        this.budget.calculateTotalIncome();
        this.budget.calculateTotalExpenses();
        this.budget.calculateTotalBalance();
      }
    )
  }
}
