import { Component, Input, OnInit } from '@angular/core';
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
export class GastoComponent implements OnInit {

  expenses: Spent[] = [];
  budget!: Budget;


  constructor(private budgetService: BudgetService,
              private storageBudgetService: StorageBudgetService) {

  }
  ngOnInit(): void {

    this.storageBudgetService.getBudgetStorage().subscribe((budget) => {
      this.budget = budget;
      this.expenses = budget.expenses || [];
    });

  }


  deleteRecord(spent: Spent) {
    this.budgetService.deleteSpentOfBudget(
      Number(this.budget.budgetId),
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
