import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../data-access/login.service';
import $ from 'jquery';


@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  fb = inject(FormBuilder)

  formLogin!: FormGroup;

  constructor(private loginService: LoginService) {

    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
      remember: [false]
    });
  }

  get formControls() {
    return this.formLogin?.controls;
  }

  ngOnInit() {
  }

  change() {
    $('.toggle-password').on('click', function () {
       let type = '';
       $(this).toggleClass('fa-eye fa-eye-slash');
       var input = $('#password-field');
       type = input.attr('type') == 'password' ? 'text' : 'password';
       input.attr('type', type);
     });
  }

  submit() {
    console.log(this.formLogin.value);
    const email = this.formLogin.get('email')?.value;
    const password = this.formLogin.get('password')?.value;
    this.loginService.login(email, password);

  }
}
