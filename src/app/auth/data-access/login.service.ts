import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { Person } from '../../persons/data-access/person.service';
import * as ls from 'local-storage';
import Swal from 'sweetalert2';
import { FirePersonStorageService } from '../../persons/data-access/storage.fcoll.service';

Injectable();
export class LoginService {
  router = inject(Router);
  storagePersonService = inject(FirePersonStorageService);

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
                .getCustomers()
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
                  this.onIdTokenRevoked();
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

  /**
   * Handles the ID token revocation event.
   * When the ID token of the current user is revoked, this function prompts the user to reauthenticate using their password.
   * If the reauthentication is successful, the user's role and information are updated, and they are redirected to the persons page.
   * If the reauthentication fails, an error message is displayed, and the user is redirected to the dashboard.
   * If an error occurs during the handling of the ID token revocation event, an error message is displayed.
   */
  async onIdTokenRevoked() {
    try {
      firebase.auth().onIdTokenChanged(async (user: firebase.User | null) => {
        // Handle token revocation here
        console.log('ID token revoked:', user?.isAnonymous);
        if (user?.isAnonymous) {
          const { value: password } = await Swal.fire({
            title: 'Please provide your password for reauthentication',
            input: 'password',
            inputLabel: 'Password',
            inputPlaceholder: 'Enter your password',
            inputAttributes: {
              maxlength: '10',
              autocapitalize: 'off',
              autocorrect: 'off',
            },
          });
          if (password) {
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
        }
      });
    } catch (error) {
      console.error('Error handling ID token revocation:', error);
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred while handling ID token revocation.',
        icon: 'error',
      });
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
