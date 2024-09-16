import { Component, input, OnInit, output } from '@angular/core';
import { Person } from '../../../class/person';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-person-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <section class="mx-auto my-5" style="max-width: 23rem;">
        <div class="card testimonial-card mt-2 mb-3">
          <div class="card-up aqua-gradient"></div>
          <div class="avatar mx-auto white">
            <img
              [src]="person().image"
              class="rounded-circle img-fluid"
              alt="person avatar"
            />
          </div>
          <div class="card-body text-center">
            <h4 class="card-title font-weight-bold">{{ person().name }}</h4>

            <span class="fa fa-phone"> {{ person().phone }}</span>
            <hr />
            <p *ngIf="person().address">
              <i class="fas fa-home"></i> City: {{ person().address.city }}
            </p>
          </div>
          <div class="text-center mb-2">
            <button class="btn btn-primary" (click)="viewPerson()">View</button>
          </div>
        </div>
      </section>
    </div>
  `,
})
export default class PersonCardComponent implements OnInit {
  ngOnInit(): void {}
  person = input.required<Person>();

  view = output<Person>();

  viewPerson() {
    this.view.emit(this.person());
  }
}
