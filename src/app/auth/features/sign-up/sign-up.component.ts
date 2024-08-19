import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
