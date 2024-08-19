import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { PersonService } from '../../data-access/person.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-person',
  standalone: true,
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {
  router = inject(Router)
  delete(id: number | undefined) {
    throw new Error('Method not implemented.');
  }
  edit(id: number | undefined) {
    this.router.navigate(['/persons/edit/', id]);
  }
  personService = inject(PersonService);
  route = inject(ActivatedRoute)
  constructor() { }

  id = this.route.snapshot.paramMap.get('id');
  person = toSignal(this.personService.getPerson(Number(this.id)));

  ngOnInit() {
  }

}
