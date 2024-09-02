import { Component, OnInit } from '@angular/core';
import { Budget } from '../../../class/budget.model';
import { BudgetService } from '../../data-access/budget.service';
import { Spent } from '../../../class/gasto.model';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { StorageBudgetService } from '../../data-access/storage.service';
import { ButtonModule } from 'primeng/button';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';


@Component({
  selector: 'app-gasto',
  standalone: true,
  templateUrl: './gasto.component.html',
  styleUrl: './gasto.component.css',
  imports: [CommonModule, InputTextModule, ButtonModule, NgxPaginationModule]
})
export class GastoComponent implements OnInit {

  expenses: Spent[] = [];
  budget!: Budget | undefined;
  p: number = 1;
  budgetId!: string;

  constructor(private budgetService: BudgetService) {
  }

  ngOnInit(): void {
    this.budgetId = JSON.parse(window.localStorage.getItem('budget')!)?.budgetId;
    this.budgetService.getBudget(Number(this.budgetId))
      .subscribe(budget => {
        this.budget = budget;
        this.expenses = this.budget?.expenses || new Array<Spent>();
      });
  }

  deleteRecord(spent: Spent) {
    this.budgetService.deleteSpentOfBudget(
      Number(this.budget?.budgetId),
      this.expenses.indexOf(spent)
    ).subscribe(
      (updatedBudget) => {
        Swal.fire({
          icon: "success",
          title: "Gasto",
          text: "Gasto eliminado",
        }).then( () => {
          this.budget = updatedBudget;
          window.location.reload()
        });
      }
    )
  }
}
