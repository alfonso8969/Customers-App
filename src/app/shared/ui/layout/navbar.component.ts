import { Component, inject } from '@angular/core';
import { Person } from '../../../class/person';
import { PersonService } from '../../../persons/data-access/person.service';
import { LoginService } from '../../../auth/data-access/login.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  template: `
    <nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top">
      <div class="container-fluid">
        <a class="navbar-brand">Customers</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/dashboard">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/persons">Customers</a>
            </li>
          </ul>
          <form class="form-inline my-2 my-lg-0">
            <div *ngIf="loginService.isAuthenticated(); else loginTemplate">
              <button class="btn btn-outline-success p-2 mx-2" (click)="logout()">
                logout
              </button>

              <span
                >{{
                  customer
                    ? 'Welcome ' + customer.name.split(' ')[0] +
                      ' ' +
                      customer.name.split(' ')[1]
                    : ''
                }}
                &nbsp;&nbsp;</span
              >

              <img
                class="img-thumbnail rounded-circle"
                width= 50px  height= 50px
                src="{{
                  customer
                    ? customer.image
                    : '../../../assets/images/user.jpg'
                }}"
              />
            </div>
            <ng-template #loginTemplate>
              <a [routerLink]="['/auth/login']" routerLinkActive="router-link-active" class="btn btn-outline-success">
                Login
              </a>
            </ng-template>
          </form>
        </div>
      </div>
    </nav>
  `,
  imports: [CommonModule, RouterModule],
})
export default class NavbarComponent {
  router = inject(Router);
  personService = inject(PersonService);
  loginService = inject(LoginService);

  customer!: Person;

  constructor() {
    if (this.loginService.isAuthenticated()) {
      this.customer = this.personService.getLocalPerson();
    }
  }

  logout() {
    this.loginService.logout();
  }
}
