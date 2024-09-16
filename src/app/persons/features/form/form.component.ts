import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { Person, PersonService } from '../../data-access/person.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';
import Swal from 'sweetalert2';
import $ from 'jquery';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, JsonPipe],
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  personService = inject(PersonService);
  fb = inject(FormBuilder);

  personForm: FormGroup;

  person!: Person | undefined;
  edit: boolean = false;
  id = this.route.snapshot.paramMap.get('id');
  errors: string[] = [];

  constructor() {
    this.personForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
          ),
        ],
      ],
      image: ['', Validators.required],
      street: ['', Validators.required],
      zipcode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      city: ['', Validators.required],
      country: ['', Validators.required],
      region: ['', Validators.required],
    });

    if (this.checkId(this.id)) {
      this.personService.getPerson(this.id!).subscribe({
        next: (person) => {
          this.person = person;
          this.edit = true;
          this.formControls['name'].setValue(this.person?.name);
          this.formControls['lastname'].setValue(this.person?.lastname);
          this.formControls['phone'].setValue(this.person?.phone);
          this.formControls['email'].setValue(this.person?.email);
          this.formControls['password'].setValue(this.person?.password);
          this.personService
            .getAddress(String(this.person?.id!))
            .subscribe((address) => {
              this.person!.address = address!;

              this.formControls['street'].setValue(this.person?.address.street);
              this.formControls['zipcode'].setValue(
                this.person?.address.zipcode
              );
              this.formControls['city'].setValue(this.person?.address.city);
              this.formControls['region'].setValue(this.person?.address.region);
              this.formControls['country'].setValue(
                this.person?.address.country
              );
              this.formControls['image'].setValue(this.person?.image);
            });
        },
        error: (error) => {
          console.error('Error fetching person:', error);
        },
      });
    } else {
      this.edit = false;
    }
  }

  get formControls() {
    return this.personForm?.controls;
  }

  checkId(id: string | null): boolean {
    return id != null || id != undefined;
  }

  resetForm(): void {
    Object.keys(this.personForm.controls).forEach((key) => {
      const control = this.personForm.get(key);
      console.log(`Key: ${key}, Value: ${control?.value}`);
      control?.setValue('');
    });
  }

  checkErrors(): string[] {
    this.errors = [];
    Object.keys(this.personForm.controls).forEach((key) => {
      const control = this.personForm.get(key);
      console.log(`Key: ${key}, Value: ${JSON.stringify(control?.errors)}`);
      for (const error in control?.errors) {
        console.log(`Error: ${error}`);
        this.errors.push(error);
      }
    });
    return this.errors;
  }

  onSubmit(): void {
    if (this.personForm?.valid) {
      if (this.edit) {
        let updatedPerson: Person = this.personForm.value;
        updatedPerson.id = Number(this.id);
        updatedPerson.budgetId = this.person?.budgetId;
        this.personService
          .updatePerson(Number(this.id), updatedPerson)
          .subscribe({
            next: (p) => {
              Swal.fire(
                'Success!',
                `Person ${p.name} updated successfully.`,
                'success'
              ).then(() => {
                this.resetForm();
                this.router.navigate(['/persons']);
              });
            },
            error: (err) => {
              console.error('Observable emitted an error: ' + err);
              Swal.fire(
                'Error!',
                'An error occurred while updating the person.',
                'error'
              );
            },
            complete: () => console.log('Update person complete notification'),
          });
      } else {
        let newPerson: Person = this.personForm.value;
        newPerson.id = this.personService.getLastId() + 1;
        newPerson.budgetId = 0;
        this.personService.addPerson(newPerson).subscribe({
          next: (p) => {
            Swal.fire(
              'Success!',
              `Person ${p.name} added successfully.`,
              'success'
            ).then(() => {
              this.resetForm();
              this.router.navigate(['/persons']);
            });
          },
          error: (err) => {
            console.error('Observable emitted an error: ' + err);
            Swal.fire(
              'Error!',
              'An error occurred while adding the person.',
              'error'
            );
          },
          complete: () => console.log('Add new Person complete notification'),
        });
      }
    } else {
      console.log('Form not valid');
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Form not valid!',
        footer: '<a href="#">Why do I have this issue?</a>',
      });
    }
  }

  change() {
    $('#password-field-eye').on('click', function () {
      let type = '';
      $(this).toggleClass('fa-eye fa-eye-slash');
      var input = $('#password-field');
      type = input.attr('type') == 'password' ? 'text' : 'password';
      input.attr('type', type);
    });
  }

  ngOnInit() {}
}
