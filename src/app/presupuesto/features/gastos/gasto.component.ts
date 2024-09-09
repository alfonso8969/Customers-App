import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { BudgetService } from './../../data-access/budget.service';
import { Budget } from '../../../class/budget.model';
import { Spent } from '../../../class/gasto.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-gasto',
  standalone: true,
  templateUrl: './gasto.component.html',
  styleUrl: './gasto.component.css',
  imports: [CommonModule, NgxPaginationModule]
})
export class GastoComponent implements OnInit {

  expenses: Spent[] = [];
  budget!: Budget | undefined;
  p: number = 1;
  budgetId!: number;

  constructor(private budgetService: BudgetService) {
  }

  ngOnInit(): void {
    this.budgetId = this.budgetService.getLocalBudget().budgetId!;
    this.budgetService.getBudget(this.budgetId)
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
