import { Component, inject, Signal } from '@angular/core';
import PersonCardComponent from '../../ui/person-card/person-card.component';
import { Person, PersonService } from '../../data-access/person.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { StoragePersonService } from '../../data-access/storage.service';
import { StorageBudgetService } from '../../../presupuesto/data-access/storage.service';

@Component({
  selector: 'app-persons',
  standalone: true,
  imports: [PersonCardComponent],
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.css']
})
export class PersonsComponent {
  personService = inject(PersonService)
  storagePersonService = inject(StoragePersonService)
  storageBudgetService = inject(StorageBudgetService)
  router = inject(Router);
  persons!: Signal<Person[] | undefined>;

  constructor() {
    this.storagePersonService.deleteLocalStoragePerson();
    this.storageBudgetService.deleteStorageLocalBudget();

    this.persons = toSignal(this.personService.getPersons());
  }

  view(person: Person) {
    console.log("The person: ", person)<
    this.storagePersonService.storageLocalPerson(person);
    this.router.navigate(['/persons/person/', person.id]);
  }
}
