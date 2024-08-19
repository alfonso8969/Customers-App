import { Injectable } from '@angular/core';
import { of } from 'rxjs';


export interface Person {
  id: string;
  name: string;
  phone: string;
  address: string;
}

const PERSONS_MOCK: Person[] = [
  {
    id: '1',
    name: 'Person 1',
    phone: "100",
    address: "Address 1",
  },
  {
    id: '2',
    name: 'Person 2',
    phone: "200",
    address: "Address 2",
  },
  {
    id: '3',
    name: 'Person 3',
    phone: "300",
    address: "Address 3",
  }

];

@Injectable()
export class PersonService {

  getPersons() {
    return of(PERSONS_MOCK);
  }

}
