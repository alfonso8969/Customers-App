import { Budget } from '../../class/budget.model';
import { Injectable , inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Person } from '../../class/person';
import { Address } from '../../class/address';
import { StoragePersonService } from './storage.service';
import Swal from 'sweetalert2';


const ADDRESS_MOCK: Address[] = [
  {
    street: 'Street 1',
    zipcode: '12345',
    city: 'City 1',
    country: 'Country 1',
    region: 'Region 1'
  },
  {
    street: 'Street 2',
    zipcode: '23456',
    city: 'City 2',
    country: 'Country 2',
    region: 'Region 2'
  },
  {
    street: 'Street 3',
    zipcode: '34567',
    city: 'City 3',
    country: 'Country 3',
    region: 'Region 3'
  },
  {
    street: 'Street 4',
    zipcode: '45678',
    city: 'City 4',
    country: 'Country 4',
    region: 'Region 4'
  }
]

let PERSONS_MOCK: Person[] = [
  {
    budgetId: 1,
    id: 1,
    name: 'Person 1',
    phone: "100754890",
    address: ADDRESS_MOCK[0],
    image: "https://randomuser.me/api/portraits/men/4.jpg"
  },
  {
    budgetId: 2,
    id: 2,
    name: 'Person 2',
    phone: "200754890",
    address: ADDRESS_MOCK[1],
    image: "https://randomuser.me/api/portraits/men/60.jpg"
  },
  {
    budgetId: 0,
    id: 3,
    name: 'Person 3',
    phone: "300754890",
    address: ADDRESS_MOCK[2],
    image: "https://randomuser.me/api/portraits/women/4.jpg"
  },
  {
    budgetId: 0,
    id: 4,
    name: "Person 4",
    phone: "400754890",
    address: ADDRESS_MOCK[3],
    image: "https://randomuser.me/api/portraits/men/21.jpg"

  }

];

@Injectable()
export class PersonService {
  storage = inject(StoragePersonService);

  private newAddress!: Address;
  private createdUpdatedPerson!: Person;

  constructor() {
    this.createPerson();
  }

  createPerson() {
    this.newAddress = {
      street: '',
      zipcode: '',
      city: '',
      country: '',
      region: ''
    };

    this.createdUpdatedPerson = {
      budgetId: 0,
      id: 0,
      name: '',
      phone: '',
      address: this.newAddress,
      image: ''
    }
  }


  getPersons(): Observable<Person[]> {
    let persons = this.storage.getPersonsStorage();
    if(persons.length !== 0) {
      return of(persons);
    }
    this.storage.storagePersons(PERSONS_MOCK);
    return of(PERSONS_MOCK);
  }

  getPerson(id: number): Observable<Person | undefined> {
    PERSONS_MOCK = this.storage.getPersonsStorage();
    return of(PERSONS_MOCK.find(p => p.id === id));
  }

  addPerson(person: any): Observable<Person> {
    PERSONS_MOCK = this.storage.getPersonsStorage();
    PERSONS_MOCK.push(this.createUpdatePerson(person));
    this.storage.storagePersons(PERSONS_MOCK);
    return of(person);
  }

  deletePerson(id: number): boolean {
    PERSONS_MOCK = this.storage.getPersonsStorage();
    const index = PERSONS_MOCK.findIndex(item => item.id === id);

    if (index !== -1) {
      // Remove the item at the found index
      PERSONS_MOCK.splice(index, 1);
    }
    this.storage.storagePersons(PERSONS_MOCK);
    return index !== -1;
  }

  updatePerson(id: number, person: any): Observable<Person> {
    PERSONS_MOCK = this.storage.getPersonsStorage();
    const index = PERSONS_MOCK.findIndex(item => item.id === id);
    if (index !== -1) {

      PERSONS_MOCK[index] = this.createUpdatePerson(person);
      this.storage.storagePersons(PERSONS_MOCK);
    } else {
      console.error(`Person with id ${id} not found.`);
      Swal.fire({
        title: 'Error',
        text: 'Could not update person.',
        icon: 'error',
        confirmButtonText: 'Okay'
      })
    }  // Return the updated person to the caller.

    return of(person);
  }

  updatePersonBudget(budgetId: number, person: Person): Observable<Person> {
    PERSONS_MOCK = this.storage.getPersonsStorage();
    const index = PERSONS_MOCK.findIndex(item => item.id === person.id);

    if (index!== -1) {
      PERSONS_MOCK[index].budgetId = budgetId;
      this.storage.storagePersons(PERSONS_MOCK);
    } else {
      console.error(`Person with id ${person.id} not found.`);
      Swal.fire({
        title: 'Error',
        text: 'Could not update person budget.',
        icon: 'error',
        confirmButtonText: 'Okay'
      })
    }  // Return the updated person to the caller.

    return of(person);

  }

  createUpdatePerson(person: any): any {
      this.createPerson();
      this.newAddress.street = person.street;
      this.newAddress.zipcode = person.zip;
      this.newAddress.city = person.city;
      this.newAddress.country = person.country;
      this.newAddress.region = person.region;

      if(person.budgetId) {
        this.createdUpdatedPerson.budgetId = person.budgetId;
      }

      this.createdUpdatedPerson.id = person.id;
      this.createdUpdatedPerson.name = person.name;
      this.createdUpdatedPerson.phone = person.phone;
      this.createdUpdatedPerson.image = person.image

    return this.createdUpdatedPerson;
  }

  getLastId() {
    PERSONS_MOCK = this.storage.getPersonsStorage();
    return PERSONS_MOCK[PERSONS_MOCK.length - 1].id;
  }

  getLastBudgetId() {
    PERSONS_MOCK = this.storage.getPersonsStorage();
    PERSONS_MOCK = PERSONS_MOCK.filter(p => p.budgetId !== 0);
    return PERSONS_MOCK[PERSONS_MOCK.length - 1].budgetId;
  }
}

export { Person };

