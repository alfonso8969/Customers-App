import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';

import { Person } from './person.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Address } from '../../class/address';
import * as ls from 'local-storage';

@Injectable({
  providedIn: 'root',
})
export class FirePersonStorageService {
  customersCollection: AngularFirestoreCollection<Person>;
  customerDoc!: AngularFirestoreDocument<Person>;
  customers!: Observable<Person[]>;
  customer!: Observable<Person>;

  addressessCollection!: AngularFirestoreCollection<Address>;
  addressDoc!: AngularFirestoreDocument<Address>;
  addressess!: Observable<Address[]>;
  address!: Address;

  constructor(private afs: AngularFirestore) {
    this.customersCollection = this.afs.collection('customers', (ref) =>
      ref.orderBy('id', 'asc')
    );
    this.addressessCollection = this.afs.collection('address', (ref) =>
      ref.orderBy('id', 'asc')
    );
  }

  // Firestore methods
  getCustomers(): Observable<Person[]> {
    this.addressess = this.addressessCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const address = a.payload.doc.data() as Address;
          address.idDB = a.payload.doc.id;
          return address;
        });
      })
    );

    this.customers = this.customersCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const person = a.payload.doc.data() as Person;
          person.idDB = a.payload.doc.id;
          console.log('Person: ', person);
          this.addressess.subscribe((addresses) => {
            person.address = addresses.find((a) => a.id === person.id)!;
            console.log('Address: ', person.address);
          });

          return person;
        });
      })
    );

    return this.customers;
  }

  getCustomerById(id: string): Observable<Person | undefined> {
    return this.customersCollection.doc(id).valueChanges({ idField: 'idDB'});
  }

  getAddressById(id: string): Observable<Address | undefined> {
    const addressesRef: AngularFirestoreCollection<Address> = this.afs.collection('address', (ref) =>
      ref.where('id', '==', Number(id))
    );

    return addressesRef.valueChanges().pipe(
      map((addresses: Address[]) => {
        if (addresses.length > 0) {
          return addresses[0];
        } else {
          return undefined;
        }
      })
    );
  }


  addCustomer(customer: Person) {
    this.address = customer.address;
    this.addressessCollection.add(this.address);
    return this.customersCollection.add(customer);
  }

  updateCustomer(id: string, customer: Person) {
    return this.customersCollection.doc(id).update(customer);
  }

  deleteCustomer(id: string) {
    return this.customersCollection.doc(id).delete();
  }

  storageLocalPerson(person: Person) {
    ls.set<Person>('person', person);
  }

  deleteLocalStoragePerson() {
    ls.remove('person');
  }

  getStorageLocalPerson(): Person {
    return ls.get<Person>('person')!;
  }
}
