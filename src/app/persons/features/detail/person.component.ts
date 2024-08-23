import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { Person, PersonService } from '../../data-access/person.service';
import { toSignal } from '@angular/core/rxjs-interop';
import Swal from 'sweetalert2'
import { JsonPipe, UpperCasePipe } from '@angular/common';


@Component({
  selector: 'app-person',
  standalone: true,
  imports: [JsonPipe, UpperCasePipe],
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {
  router = inject(Router)
  personService = inject(PersonService);
  address: string | undefined = "";
  id!: string;
  person!: Signal<Person | undefined>;


  constructor(private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.person = toSignal(this.personService.getPerson(Number(this.id)))!;
  }

  ngOnInit() {
    this.address = "Street: " + this.person()?.address.street + "\n\tZip-Code: " + this.person()?.address.zipcode
      + "\n\tCity: " + this.person()?.address.city +
      "\n\tCountry: " + this.person()?.address.country + "\n\tRegion: " + this.person()?.address.region;
  }

  presupuesto(budgetId: number | undefined) {
    if (budgetId && budgetId !== 0) {
      this.navigateBudget(budgetId);
    } else {
      Swal.fire({
        title: "Information!",
        text: `The Customer ${this.person()?.name} don't have budget yet.\n
        Do you want to create one now?`,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
      }).then((result) => {
        if (result.isConfirmed) {
          let lastBudgetId = this.personService.getLastBudgetId()!;
          this.person()!.budgetId = lastBudgetId + 1;
          if (this.person()?.budgetId)
            this.personService.updatePersonBudget(this.person()?.id!, this.person()!)
              .subscribe(p => {
                if (p) {
                  Swal.fire(
                    'Success!',
                    `Budget for ${p.name} created successfully.`,
                    'success'
                  ).then(() => {
                    this.navigateBudget(p.budgetId);
                  });
                }
              }
            );
        }
      });
    }
  }


  navigateBudget(budgetId: number | undefined) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        budgetId: budgetId,
        personId: this.person()?.id
      }
    };
    this.router.navigate(['/presupuestos/presupuesto'], navigationExtras);

  }

  delete(id: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.personService.deletePerson(id))
          Swal.fire({
            title: "Deleted!",
            text: `Person ${this.person()?.name} has been deleted.`,
            icon: "success"
          });
        else
          Swal.fire({
            title: "Error!",
            text: "Failed to delete the person.",
            icon: "error"
          });
        this.router.navigate(['/persons']);
      }
    });
  }

  edit(id: number | undefined) {
    this.router.navigate(['/persons/edit/', id]);
  }
}
