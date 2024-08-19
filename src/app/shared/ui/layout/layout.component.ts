import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import NavbarComponent from './navbar.component';
import FooterComponent from './footer.component';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar />
    <div class="container-fluid dsc-skeleton-content">
        <router-outlet></router-outlet>
    </div>


    <app-footer />
  `,
})
export default class LayoutComponent {}
