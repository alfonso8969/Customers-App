import { Observable, of } from 'rxjs';
import { Person } from '../../class/person'
export class StoragePersonService {
  persons: Person[] = [];
  person!: Person;

  constructor() {

  }

  getPersonsStorage(): Person[] {
    this.persons = JSON.parse(localStorage?.getItem('persons')!);
    return this.persons ?? new Array<Person>();
  }

  getPersonStorage(): Observable<Person> {
    if(localStorage?.getItem('person')!== "undefined") {
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
    localStorage?.setItem('persons', JSON.stringify(persons));
  }

  storagePerson(person: Person) {
    localStorage?.setItem('person', JSON.stringify(person));
  }
}
