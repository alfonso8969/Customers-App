import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
;

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
