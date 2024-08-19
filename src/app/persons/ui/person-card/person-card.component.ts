import { Component, input, output } from '@angular/core';
import { Person } from '../../data-access/person.service';

@Component({
  selector: 'app-person-card',
  standalone: true,
  template: `
    <div class="container">
      <h2>{{ person().name }}</h2>

      <p>Phone {{ person().phone }}</p>

      <label for="address">Address</label>
      <textarea id="address" rows="6" cols="30">{{ person().address }}</textarea>
      <p></p>

      <button (click)="viewPerson()">View</button>
    </div>
  `,
})
export default class PersonCardComponent {
  person = input.required<Person>();

  view = output<Person>();

  viewPerson() {
    this.view.emit(this.person());
  }
}
