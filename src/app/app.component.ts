import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import firebase from 'firebase/compat/app';
import { LoginService } from './auth/data-access/login.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  title = 'Customer-App';

  // PrimeNG configuration provider to enable ripple effect globally.
  constructor(
    private primengConfig: PrimeNGConfig,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    firebase.initializeApp({
      apiKey: 'AIzaSyBJIimmC1C5FCmoJSjuf7C_hrazHEaVujo',
      authDomain: 'customers-987c4.firebaseapp.com',
    });
    this.loginService.onIdTokenRevoked();
  }
}
