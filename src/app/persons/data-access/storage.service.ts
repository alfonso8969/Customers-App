import { map, Observable, of, Subscription, throwError } from 'rxjs';
import { Person } from '../../class/person';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import * as ls from 'local-storage';

@Injectable()
export class StoragePersonService {
  httpClient = inject(HttpClient);
  persons: Person[] = [];
  person!: Person;
  url: string = 'https://customers-987c4-default-rtdb.firebaseio.com/';
  endPoint: string = 'persons.json';
  endPointDelUp: string = 'persons/';

  constructor() {}

  getPersonsStorage(): Observable<Person[]> {
    return this.httpClient.get<Person[]>(
      this.url + this.endPoint + '?auth=' + this.getToken()
    );
  }

  getPersonStorage(id: number): Observable<Person> {
    return this.httpClient
      .get<Person[]>(this.url + this.endPoint + '?auth=' + this.getToken())
      .pipe(map((ps) => ps.find((p) => p.id === id)!));
  }

  storagePersons(persons: Person[]) {
    this.httpClient
      .put(this.url + this.endPoint + '?auth=' + this.getToken(), persons)
      .subscribe({
        next: (data) => {
          console.log('result of save persons: ', data);
        },
        error: (error) => {
          console.error('Error at save persons', error);
        },
      });
  }

  deletePersonStorage(id: number | undefined): Subscription {
    let index: number | string = id! - 1;
    let url: string =
      this.url + this.endPointDelUp + index + '.json?auth=' + this.getToken();
    return this.httpClient
      .delete(url, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        observe: 'body',
        responseType: 'json',
      })
      .subscribe({
        next: (data) => {
          console.log('result of delete person: ', data);
        },
        error: (error) => {
          console.error('Error at delete person', error);
          this.handleError(error);
        },
      });
  }

  updatePersonStorage(person: Person): Subscription {
    let index: number | string = person.id! - 1;
    let url: string =
      this.url + this.endPointDelUp + index + '.json?auth=' + this.getToken();
    var raw = JSON.stringify(person);
    return this.httpClient
      .put(url, raw, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        observe: 'body',
        responseType: 'json',
      })
      .subscribe({
        next: (data) => {
          console.log('result of update person: ', data);
        },
        error: (error) => {
          console.error('Error at update person', error);
          this.handleError(error);
        },
      });
  }

  storageLocalPerson(person: Person) {
    ls.set<string>('person', JSON.stringify(person));
  }

  deleteLocalStoragePerson() {
    ls.remove('person');
  }

  getStorageLocalPerson(): Person {
    return JSON.parse(ls.get('person')!);
  }

  getToken() {
    return ls.get('token') ?? '';
  }

  // Error handling
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
