import { Person } from '../../class/person'
export class StoragePersonService {
  persons: Person[] = [];

  constructor() {

  }

  getPersonStorage(): Person[] {
    this.persons = JSON.parse(localStorage?.getItem('persons')!);
    return this.persons ?? new Array<Person>();
  }

  storagePersons(persons: Person[]) {
    localStorage?.setItem('persons', JSON.stringify(persons));
  }
}
