import {
  ActivatedRoute,
  NavigationExtras,
  Router,
  RouterModule,
} from '@angular/router';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { Person, PersonService } from '../../data-access/person.service';
import { toSignal } from '@angular/core/rxjs-interop';
import Swal from 'sweetalert2';
import { JsonPipe, UpperCasePipe } from '@angular/common';
import { Budget } from '../../../class/budget.model';
import { StorageBudgetService } from '../../../presupuesto/data-access/storage.service';
import { BudgetService } from '../../../presupuesto/data-access/budget.service';

@Component({
  selector: 'app-person',
  standalone: true,
  imports: [JsonPipe, UpperCasePipe, RouterModule],
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css'],
})
export class PersonComponent implements OnInit {
  router = inject(Router);
  personService = inject(PersonService);
  budgetService = inject(BudgetService);
  storageBudgetService = inject(StorageBudgetService);

  address: string | undefined = '';
  id!: string;
  person!: Person | undefined;

  constructor(private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.personService.getPerson(this.id)
    .subscribe((person) => {
      this.person = person;
      console.log("Person subcribe in detail : ", person);
      console.log("Person in detail: ", this.person);
      this.personService
        .getAddress(String(this.person?.id!))
        .subscribe((address) => {
          this.person!.address = address!;
          this.address =
            '\n\tStreet: ' +
            this.person?.address.street +
            '\n\tZip-Code: ' +
            this.person?.address.zipcode +
            '\n\tCity: ' +
            this.person?.address.city +
            '\n\tCountry: ' +
            this.person?.address.country +
            '\n\tRegion: ' +
            this.person?.address.region;
        });

    });
  }

  ngOnInit() {}

  presupuesto(budgetId: number | undefined) {
    if (this.person && this.person?.budgetId !== 0) {
      this.budgetService
        .getBudget(budgetId!)
        .subscribe((budget) => {
          if (budget) {
            this.budgetService.setLocalBudget(budget);
            this.navigateBudget(budget.budgetId!);
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Budget not found',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        });
    } else {
      Swal.fire({
        title: 'Information!',
        text: `The Customer ${this.person?.name} don't have budget yet.\n
        Do you want to create one now?`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          let lastBudgetId = this.personService.getLastBudgetId()!;
          this.person!.budgetId = lastBudgetId + 1;
          if (this.person?.budgetId) {
            let budget = new Budget();
            budget.budgetId = this.person?.budgetId;
            budget.incomes = [];
            budget.expenses = [];
            budget.calculateTotalIncome();
            budget.calculateTotalExpenses();
            budget.calculateTotalBalance();

            this.budgetService.addBudget(budget).subscribe((b) => {
              if (b.budgetId) {
                this.personService
                  .updatePerson(this.person?.id!, this.person!)
                  .subscribe((p) => {
                    if (p) {
                      Swal.fire(
                        'Success!',
                        `Budget for ${this.person?.name} created successfully.`,
                        'success'
                      ).then(() => {
                        this.navigateBudget(p.budgetId);
                      });
                    } else {
                      Swal.fire(
                        'Error!',
                        `Error creating budget for ${this.person?.name}`,
                        'error'
                      ).then(() => {});
                    }
                  });
              } else {
                Swal.fire(
                  'Error!',
                  `Error creating budget for ${this.person?.name}`,
                  'error'
                ).then(() => {});
              }
            });
          }
        }
      });
    }
  }

  navigateBudget(budgetId: number | undefined) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        budgetId: budgetId,
        personId: this.person?.id,
      },
    };
    this.router.navigate(['/budgets/budget'], navigationExtras);
  }

  delete(id: string | undefined) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.personService.deletePerson(id))
          Swal.fire({
            title: 'Deleted!',
            text: `Person ${this.person?.name} has been deleted.`,
            icon: 'success',
          }).then(() => {
            this.router.navigate(['/persons']);
          });
        else
          Swal.fire({
            title: 'Error!',
            text: 'Failed to delete the person.',
            icon: 'error',
          }).then();
      }
    });
  }

  edit(id: string | undefined) {
    this.router.navigate(['/persons/edit/', id]);
  }
}
