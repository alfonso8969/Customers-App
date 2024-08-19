import { Component, inject } from '@angular/core';
import PersonCardComponent from '../../ui/person-card/person-card.component';
import { Person, PersonService } from '../../data-access/person.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-persons',
  standalone: true,
  imports: [PersonCardComponent],
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.css']
})
export class PersonsComponent {

  personService = inject(PersonService)

  persons = toSignal(this.personService.getPersons());


  view(person: Person) {
    alert(`The person name is ${person.name}`)
  }

}
