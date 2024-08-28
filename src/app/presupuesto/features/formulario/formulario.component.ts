import { Component, OnInit, Signal } from '@angular/core';
import { BudgetService } from '../../data-access/budget.service';
import { StorageBudgetService } from '../../data-access/storage.service';
import { Budget } from '../../../class/budget.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { Income } from '../../../class/ingreso.model';
import { Spent } from '../../../class/gasto.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formulario',
  standalone: true,
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css',
  imports: [FormsModule, CommonModule]
})

export class FormularioComponent implements OnInit {
  budget!: Signal<Budget | undefined>;
  income!: Income;
  spent!: Spent;
  typeOption: string = "opInc";

  constructor(private budgetService: BudgetService,
    private storageBudgetService: StorageBudgetService) {
    this.budget = toSignal(this.storageBudgetService.getBudgetStorage());
  }

  ngOnInit(): void {

  }

  option(event: any) {
    this.typeOption = event?.target.value;
  }


  createRecord(f: NgForm) {
    let formValue = f.value;
    if (this.typeOption === "opInc") {
      this.income = new Income(f.value, Number(f.value), new Date());
      this.budget = toSignal(this.budgetService.addIncomeSpentToBudget(
        Number(this.budget()?.budgetId),
        this.typeOption,
        this.income,
        undefined
      ));

    } else {
      

    }
  }

}
