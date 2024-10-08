import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { BudgetService } from '../../data-access/budget.service';
import { Budget } from '../../../class/budget.model';
import { Income } from '../../../class/ingreso.model';
import * as ls from 'local-storage';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ingreso',
  standalone: true,
  templateUrl: './ingreso.component.html',
  styleUrl: './ingreso.component.css',
  imports: [CommonModule, NgxPaginationModule]
})
export class IngresoComponent implements OnInit {

  p1: number = 1;
  incomes: Income[] = [];
  budget!: Budget | undefined;
  budgetId!: string;

  constructor(private budgetService: BudgetService) {
  }

  ngOnInit(): void {
    this.budgetId = JSON.parse(ls.get<string>('budget')!)?.budgetId;
    this.budgetService.getBudget(Number(this.budgetId))
      .subscribe(budget => {
        this.budget = budget;
        this.incomes = this.budget?.incomes || new Array<Income>();
      });
  }

  deleteRecord(income: Income) {
    this.budgetService.deleteIncomeOfBudget(
      Number(this.budget?.budgetId),
      this.incomes.indexOf(income)
    ).subscribe(
      (updatedBudget) => {
        Swal.fire({
          icon: "success",
          title: "Ingreso",
          text: "Ingreso eliminado",
        }).then(() => {
          this.budget = updatedBudget;
          window.location.reload()
        });
      }
    )
  }
}
