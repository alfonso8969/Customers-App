import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'Customer-App';



  constructor(private primengConfig: PrimeNGConfig) {

  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    firebase.initializeApp({
      apiKey: 'AIzaSyBJIimmC1C5FCmoJSjuf7C_hrazHEaVujo',
      authDomain: 'customers-987c4.firebaseapp.com',
      databaseURL: 'https://customers-987c4-default-rtdb.firebaseio.com',
      projectId: 'customers-987c4',
      storageBucket: 'customers-987c4.appspot.com',
      messagingSenderId: '229139082377',
      appId: '1:229139082377:web:56ee96ef222b1bb805aa58',
    });
  }
}
