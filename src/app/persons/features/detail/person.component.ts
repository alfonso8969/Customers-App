import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { PersonService } from '../../data-access/person.service';
import { toSignal } from '@angular/core/rxjs-interop';
import Swal from 'sweetalert2'
import { JsonPipe } from '@angular/common';


@Component({
  selector: 'app-person',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {
  router = inject(Router)
  personService = inject(PersonService);
  route = inject(ActivatedRoute)
  address: string | undefined = "";

  constructor() { }

  id = this.route.snapshot.paramMap.get('id');
  person = toSignal(this.personService.getPerson(Number(this.id)));

  ngOnInit() {
    this.address = "Street: " + this.person()?.address.street + "\n\tZip-Code: " + this.person()?.address.zipcode
    + "\n\tCity: " + this.person()?.address.city +
     "\n\tCountry: " + this.person()?.address.country + "\n\tRegion: " + this.person()?.address.region ;
  }

  delete(id: number | undefined) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });
  }

  edit(id: number | undefined) {
    this.router.navigate(['/persons/edit/', id]);
  }


}
