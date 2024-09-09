import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import { Person } from "../../persons/data-access/person.service";
import { StoragePersonService } from "../../persons/data-access/storage.service";
import * as ls from 'local-storage';
import Swal from "sweetalert2";
import { AngularFireAuth } from "@angular/fire/compat/auth";

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
            if (this.token) {
              ls.set('token', token);
              this.storagePersonService
                .getPersonsStorage()
                .subscribe((persons: Person[]) => {
                  this.person = persons.find(
                    (person: Person) => person.email === email
                  )!;
                  if (!this.person) {
                    Swal.fire({
                      title: 'Error!',
                      text: 'No person found with this email.',
                      icon: 'error',
                    });
                    return;
                  }

                  if (typeof this.person.rol === 'string')
                    this.roleAs =
                      this.person.rol === 'admin' ? 1 : 'user' ? 2 : 0;
                  else if (typeof this.person.rol === 'object')
                    this.roleAs =
                      this.person.rol?.type === 'admin' ? 1 : 'user' ? 2 : 0;
                  this.storagePersonService.storageLocalPerson(this.person);
                  sessionStorage.setItem('role', this.roleAs.toString());
                  sessionStorage.setItem(
                    'userLogged',
                    JSON.stringify(this.person)
                  );
                  this.router.navigate(['/persons']);
                });
            } else {
              console.error('Error getting token:', token);
              Swal.fire({
                title: 'Error!',
                text: 'An error occurred while getting the token.',
                icon: 'error',
              });
            }
          });
      })
      .catch((error) => {
        console.error('Error getting token:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Credentials are not valid.',
          icon: 'error',
        });
      });
  }

  async onIdTokenRevoked() {
    try {
      firebase.auth().onIdTokenChanged(async (user: firebase.User | null) => {
        // Handle token revocation here
        console.log('ID token revoked:', user?.isAnonymous);
        if(user?.isAnonymous) {
           let password = prompt(
             'Please provide your password for reauthentication'
           );
           let credential = firebase.auth.EmailAuthProvider.credential(
             firebase.auth().currentUser?.email!,
             password!
           );
           firebase
             .auth()
             .currentUser?.reauthenticateWithCredential(credential)
             .then((result) => {
               // User successfully reauthenticated. New ID tokens should be valid.
               this.person = result.user as unknown as Person;
               console.log('Result token revoked:', result.user);
               if (typeof this.person.rol === 'string')
                 this.roleAs = this.person.rol === 'admin' ? 1 : 'user' ? 2 : 0;
               else if (typeof this.person.rol === 'object')
                 this.roleAs =
                   this.person.rol?.type === 'admin' ? 1 : 'user' ? 2 : 0;
               this.storagePersonService.storageLocalPerson(this.person);
               sessionStorage.setItem('role', this.roleAs.toString());
               sessionStorage.setItem(
                 'userLogged',
                 JSON.stringify(this.person)
               );
               this.router.navigate(['/persons']);
             })
             .catch((error) => {
               // An error occurred.
               console.error('Error reauthenticating:', error);
               Swal.fire({
                 title: 'Error!',
                 text: 'Credentials are not valid.',
                 icon: 'error',
               });
               this.router.navigate(['/dashboard']);
             });
        }

      });
    } catch (error) {
      console.error('Error handling ID token revocation:', error);
    }
  }

  logout(): void {
    firebase.auth().signOut();
    ls.remove('token');
    ls.remove('person');
    sessionStorage.removeItem('userLogged');
    sessionStorage.removeItem('role');
    this.router.navigate(['/dashboard']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string {
    return ls.get<string>('token') ?? '';
  }

  gR(): number {
    this.roleAs = Number(sessionStorage.getItem('role')!);
    return this.roleAs;
  }
}
