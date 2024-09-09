import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import {
  AngularFireDatabase,
  AngularFireObject,
} from '@angular/fire/compat/database';
import { Person } from './person.service';

@Injectable({
  providedIn: 'root',
})
export class FirePersonStorageService {
  customersCollection: AngularFirestoreCollection<Person>;

  constructor(private afs: AngularFirestore) {
    this.customersCollection = this.afs.collection('customers');
  }

  // Firestore methods
  getCustomers() {
    return this.customersCollection.snapshotChanges();
  }

  getCustomerById(id: string) {
    return this.customersCollection.doc(id).valueChanges();
  }

  addCustomer(customer: Person) {
    return this.customersCollection.add(customer);
  }

  updateCustomer(id: string, customer: Person) {
    return this.customersCollection.doc(id).update(customer);
  }

  deleteCustomer(id: string) {
    return this.customersCollection.doc(id).delete();
  }
}
