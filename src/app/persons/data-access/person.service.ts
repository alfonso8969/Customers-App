import { Injectable } from '@angular/core';
import { of } from 'rxjs';


export interface Person {
  id: number;
  name: string;
  phone: string;
  address: string;
  image?: string;
}

const PERSONS_MOCK: Person[] = [
  {
    id: 1,
    name: 'Person 1',
    phone: "100",
    address: "Address 1",
    image: "https://via.placeholder.com/150/09f/fff?text=Person+1"
  },
  {
    id: 2,
    name: 'Person 2',
    phone: "200",
    address: "Address 2",
    image: "https://via.placeholder.com/150/009/fff?text=Person+2"
  },
  {
    id: 3,
    name: 'Person 3',
    phone: "300",
    address: "Address 3",
    image: "https://via.placeholder.com/150/900/fff?text=Person+3"
  },
  {
    id: 4,
    name: "Person 4",
    phone: "400",
    address: "Address 4",
    image: "https://via.placeholder.com/150/09f/fff?text=Person+4"

  }

];

@Injectable()
export class PersonService {

  getPersons() {
    return of(PERSONS_MOCK);
  }

  getPerson(id: number) {
    return of(PERSONS_MOCK.find(p => p.id === id));
  }
}

