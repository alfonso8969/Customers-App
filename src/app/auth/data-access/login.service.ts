import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import { Person } from "../../persons/data-access/person.service";
import { StoragePersonService } from "../../persons/data-access/storage.service";
import * as ls from 'local-storage';

Injectable()
export class LoginService {
  router = inject(Router);
  storagePersonService = inject(StoragePersonService);

  token!: string;
  person!: Person;
  roleAs!: number;

  constructor() {}

  login(email: string, password: string): void {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        firebase
          .auth()
          .currentUser?.getIdToken(true)
          .then((token: string) => {
            this.token = token;
            ls.set('token', token);
            this.storagePersonService
              .getPersonsStorage()
              .subscribe((persons: Person[]) => {
                this.person = persons.find(
                  (person: Person) => person.email === email
                )!;
                if (typeof this.person.rol === 'string')
                  this.roleAs = this.person.rol === 'admin' ? 1 : 'user' ? 2 : 0;
                else if(typeof this.person.rol === 'object')
                  this.roleAs = this.person.rol?.type === 'admin' ? 1 : 'user' ? 2 : 0;
                this.storagePersonService.storageLocalPerson(this.person);
                sessionStorage.setItem('ROLE', this.roleAs.toString());
                sessionStorage.setItem('userLogged', JSON.stringify(this.person));
                this.router.navigate(['/persons']);
              });
          });
      });
  }

  logout(): void {
    firebase.auth().signOut();
    ls.remove('token');
    this.router.navigate(['/#']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string {
    return ls.get<string>('token') ?? '';
  }

  gR(): number {
    this.roleAs = Number(sessionStorage.getItem('ROLE')!);
    return this.roleAs;
  }
}
