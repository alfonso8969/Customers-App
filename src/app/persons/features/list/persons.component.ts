import { Component, inject, Signal } from '@angular/core';
import PersonCardComponent from '../../ui/person-card/person-card.component';
import { Person, PersonService } from '../../data-access/person.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { StoragePersonService } from '../../data-access/storage.service';
import { StorageBudgetService } from '../../../presupuesto/data-access/storage.service';
import { CommonModule } from '@angular/common';
import { Rol } from '../../../class/rol';

@Component({
  selector: 'app-persons',
  standalone: true,
  imports: [PersonCardComponent, CommonModule, RouterModule],
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.css'],
})
export class PersonsComponent {
  router = inject(Router);

  personService = inject(PersonService);
  storagePersonService = inject(StoragePersonService);
  storageBudgetService = inject(StorageBudgetService);

  persons!: Signal<Person[] | undefined>;
  roleAs: string | Rol | undefined = '';

  constructor() {
    this.storageBudgetService.deleteStorageLocalBudget();

    this.persons = toSignal(this.personService.getPersons());
    this.roleAs =
      typeof this.personService.getUserLogged().rol === 'string'
        ? this.personService.getUserLogged().rol
        : Number(this.personService.getUserLogged().rol?.type) == 1
        ? 'admin'
        : 'user';
  }

  getSaldoTotal() {
    let saldoTotal: number = 0;
    if (this.persons()) {
      this.persons()?.forEach((cliente) => {
        if (cliente.budgetId !== undefined) {
          saldoTotal += 125.14;
        }
      });
    }
    return saldoTotal;
  }

  view(person: Person) {
    console.log('The person: ', person);
    this.storagePersonService.storageLocalPerson(person);
    this.router.navigate(['/persons/person/', person.idDB]);
  }
}
