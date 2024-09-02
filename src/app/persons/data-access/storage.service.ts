import { Observable, of } from 'rxjs';
import { Person } from '../../class/person'
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable()
export class StoragePersonService {
  httpClient = inject(HttpClient)
  persons: Person[] = [];
  person!: Person;
  url: string = "https://customers-987c4-default-rtdb.firebaseio.com/";
  endPoint: string = "persons.json"

  constructor() {

  }

  getPersonsStorage(): Observable<Person[]> {
    return this.httpClient.get<Person[]>(this.url + this.endPoint);
  }

  getPersonStorage(): Observable<Person> {
    if(localStorage?.getItem('person') !== "undefined") {
      this.person = JSON.parse(localStorage?.getItem('person')!);
    }
    return of(this.person) ?? new Person(
      0,
      '',
      '',
      {
        street: '',
        zipcode: '',
        city: '',
        country: '',
        region: ''
      }
    );
  }

  storagePersons(persons: Person[]) {
    this.httpClient.put(this.url + this.endPoint, persons)
    .subscribe({
      next: data => {
        console.log("result of save persons: ", data);
      },
      error: error => {
        console.error('Error at save persons', error);
      }
    });
  }

  storagePerson(person: Person) {
    localStorage?.setItem('person', JSON.stringify(person));
  }
}
