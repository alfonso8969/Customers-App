import { Budget } from '../../class/budget.model';
import { Injectable, Signal, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Person } from '../../class/person';
import { Address } from '../../class/address';
import { StoragePersonService } from './storage.service';
import Swal from 'sweetalert2';
import { toSignal } from '@angular/core/rxjs-interop';
import { BudgetService } from '../../presupuesto/data-access/budget.service';
import { Rol } from '../../class/rol';
import { Roles } from '../../class/roles';

@Injectable({ providedIn: 'root' })
export class PersonService {
  storage = inject(StoragePersonService);
  budgetService = inject(BudgetService);

  persons!: Signal<Person[] | undefined>;
  private newAddress!: Address;
  private createdUpdatedPerson!: Person;
  person!: Person;

  constructor() {
    this.createPerson();
    const personsObservable = this.storage.getPersonsStorage();
    this.persons = toSignal(personsObservable);
  }

  createPerson() {
    this.newAddress = {
      street: '',
      zipcode: '',
      city: '',
      country: '',
      region: '',
    };

    this.createdUpdatedPerson = {
      budgetId: 0,
      id: 0,
      email: '',
      password: '',
      name: '',
      phone: '',
      address: this.newAddress,
      image: '',
      rol: new Rol(Roles.user),
    };
  }

  /**
   * Función que regresa al usuario logueado correctamente
   */
  public getUserLogged(): Person {
    let userLogged = sessionStorage.getItem('userLogged');
    if (userLogged && userLogged != 'undefined') {
      console.log(
        'sessionStorage userLogged LoginService: ',
        JSON.parse(sessionStorage.getItem('userLogged')!)
      );
      this.person = JSON.parse(userLogged);
    } else {
      let userLogged = localStorage.getItem('person');
      if (userLogged && userLogged != 'undefined') {
        this.person = JSON.parse(userLogged);
      }
    }

    return this.person;
  }

  getPersons(): Observable<Person[]> {
    return this.storage.getPersonsStorage();
  }

  getPerson(id: number): Observable<Person | undefined> {
    return this.storage.getPersonStorage(id);
  }

  addPerson(person: any): Observable<Person> {
    let personArray: Array<Person> = new Array<Person>();
    if (this.persons()) {
      this.persons()?.push(this.createUpdatePerson(person));
    } else {
      personArray.push(this.createUpdatePerson(person));
    }
    this.storage.storagePersons(this.persons() ?? personArray);
    return of(person);
  }

  deletePerson(id: number | undefined): boolean {
    let budgetId = this.persons()?.find((item) => item.id === id)?.budgetId;
    this.budgetService.deleteBudget(budgetId ?? 0);
    let index = this.persons()?.findIndex((item) => item.id === id);
    if (index !== -1) {
      // Remove the item at the found index
      this.persons()?.splice(index!, 1);
    }
    this.storage.deletePersonStorage(id);
    return index !== -1;
  }

  updatePerson(id: number, person: any): Observable<Person> {
    let index = this.persons()?.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.persons()![index!] = this.createUpdatePerson(person);
      this.storage.updatePersonStorage(this.persons()![index!]);
      this.storage.storageLocalPerson(this.persons()![index!]);
    } else {
      console.error(`Person with id ${id} not found.`);
      Swal.fire({
        title: 'Error',
        text: 'Could not update person.',
        icon: 'error',
        confirmButtonText: 'Okay',
      });
    } // Return the updated person to the caller.

    return of(person);
  }

  createUpdatePerson(person: any): any {
    this.createPerson();

    this.newAddress.street = person.street ?? person.address.street;
    this.newAddress.zipcode = person.zipcode ?? person.address.zipcode;
    this.newAddress.city = person.city ?? person.address.city;
    this.newAddress.country = person.country ?? person.address.country;
    this.newAddress.region = person.region ?? person.address.region;

    if (person.budgetId) {
      this.createdUpdatedPerson.budgetId = person.budgetId;
    }

    this.createdUpdatedPerson.id = person.id;
    this.createdUpdatedPerson.name = person.name;
    this.createdUpdatedPerson.phone = person.phone;
    this.createdUpdatedPerson.email = person.email;
    this.createdUpdatedPerson.password = person.password;
    this.createdUpdatedPerson.image = person.image;

    return this.createdUpdatedPerson;
  }

  getLocalPerson(): Person {
    return this.storage.getStorageLocalPerson();
  }

  setLocalPerson(person: Person) {
    this.storage.storageLocalPerson(person);
  }

  getLastId(): number {
    return this.persons() ? this.persons()![this.persons()!.length - 1].id : 1;
  }

  getLastBudgetId() {
    let persons = this.persons()
      ? this.persons()?.filter((p) => p.budgetId !== 0)
      : new Array<Person>();
    return persons?.length! > 0 ? persons![persons!.length - 1].budgetId : 0;
  }
}

export { Person };

