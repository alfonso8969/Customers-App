import { Person } from '../../class/person'


export class StorageService {
  persons: Person[] = [];


  constructor() {

    if (typeof window !== 'undefined' && window.localStorage) {
      console.log("Si window.localStorage");
    } else {
      console.log('No window.localStorage');
    }
  }

  getPersonStorage(): Person[] {
    this.persons = JSON.parse(localStorage?.getItem('persons')!);
    if(this.persons) {
      return this.persons;
    }

    return new Array<Person>();

  }

  storagePersons(persons: Person[]) {
    localStorage?.setItem('persons', JSON.stringify(persons));
  }

}
