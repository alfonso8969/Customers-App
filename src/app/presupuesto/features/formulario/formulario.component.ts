import { Component, OnInit, Signal } from '@angular/core';
import { BudgetService } from '../../data-access/budget.service';
import { StorageBudgetService } from '../../data-access/storage.service';
import { Budget } from '../../../class/budget.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Income } from '../../../class/ingreso.model';
import { Spent } from '../../../class/gasto.model';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario',
  standalone: true,
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css',
  imports: [ReactiveFormsModule, CommonModule]
})

export class FormularioComponent implements OnInit {

  operationForm!: FormGroup;
  budget!: Budget;
  income!: Income;
  spent!: Spent;
  typeOption: string = "opInc";
  errors!: string[];

  constructor(private budgetService: BudgetService,
    private fb: FormBuilder) {

    this.operationForm = this.fb.group({
      description: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      date: [new Date()]
    })
  }

  get formControls() {
    return this.operationForm?.controls;
  }

  ngOnInit(): void {

  }

  option(event: any) {
    this.typeOption = event?.target.value;
  }


  resetForm() {
    Object.keys(this.operationForm.controls).forEach(key => {
      const control = this.operationForm.get(key);
      console.log(`Key: ${key}, Value: ${control?.value}`);
      control?.setValue("");
    });
  }

  createRecord() {
    this.budget = JSON.parse(window.localStorage.getItem('budget')!);
    if (this.operationForm?.valid) {
      if (this.typeOption === "opInc") {
        this.income = this.operationForm.value;
        this.budgetService.addIncomeSpentToBudget(this.budget, this.typeOption, this.income, undefined)
        .subscribe((budget: Budget) => {
          if(budget.budgetId) {
            Swal.fire({
              icon: "success",
              title: "Ingreso",
              text: "Ingreso realizado",
            }).then( () => {
              this.resetForm();
              window.location.reload()
            });
          }
        })
      } else {
        this.spent = this.operationForm.value;
        this.budgetService.addIncomeSpentToBudget(this.budget, this.typeOption, undefined, this.spent)
        .subscribe((budget: Budget) => {
          if(budget.budgetId) {
            Swal.fire({
              icon: "success",
              title: "Gasto",
              text: "Gasto anotado",
            }).then( () => {
              this.resetForm();
              window.location.reload()
            });
          }
        })
      }
    } else {
      console.log('Form not valid');
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Form not valid!",
        footer: '<a href="#">Why do I have this issue?</a>'
      });
    }
  }


  checkErrors() {
    this.errors = [];
    Object.keys(this.operationForm.controls).forEach(key => {
      const control = this.operationForm.get(key);
      console.log(`Key: ${key}, Value: ${JSON.stringify(control?.errors)}`);
      for (const error in control?.errors) {
        console.log(`Error: ${error}`);
        this.errors.push(error);
      }
    });
    return this.errors;
  }
}
