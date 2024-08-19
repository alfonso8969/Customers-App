import { ActivatedRoute } from '@angular/router';
import { Component, inject, OnInit, PLATFORM_ID, Signal } from '@angular/core';
import { Person, PersonService } from '../../data-access/person.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  route = inject(ActivatedRoute)
  personService = inject(PersonService);
  fb = inject(FormBuilder)
  platformId = inject(PLATFORM_ID)

  personForm: FormGroup;
  person!: Signal<Person | undefined>;
  edit: boolean = false;
  id = this.route.snapshot.paramMap.get('id');
  isPlatFormBrowser: boolean;
  divId!: HTMLElement;

  constructor() {
    this.isPlatFormBrowser = isPlatformBrowser(this.platformId);
    this.personForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      address: ['', Validators.required],
      image: ['', Validators.required]
    });
    if (this.checkId(this.id)) {
      this.person = toSignal(this.personService.getPerson(Number(this.id)));
      this.edit = true;

      this.formControls['id'].setValue(this.person()?.id);
      this.formControls['name'].setValue(this.person()?.name);
      this.formControls['phone'].setValue(this.person()?.phone);
      this.formControls['address'].setValue(this.person()?.address);
      this.formControls['image'].setValue(this.person()?.image);


    } else {
      this.edit = false;
    }
  }


  get formControls() {
    return this.personForm?.controls;
  }

  checkId(id: string | null) {
    return id != null || id != undefined;
  }



  onSubmit() {
    if (this.personForm?.valid) {
      console.log('Form Submitted!', this.personForm.value);
    } else {
      console.log('Form not valid');
    }
  }


  ngOnInit() {
  }

}
