import { Address } from "./address";


export class Person {

  private _budgetId?: number | undefined;

  constructor(id: number, name: string, phone: string, address: Address, image?: string) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.address = address;
    this.image = image;
  }

  static fromJson(json: any): Person {
    return new Person(json.id, json.name, json.phone, json.address, json.image);
  }

  get budgetId(): number | undefined {
    return this._budgetId;
  }

  set budgetId(value: number | undefined) {
    this._budgetId = value;
  }

  get id(): number {
    return this.id;
  }

  set id(value: number) {
    this.id = value;
  }

  get name(): string {
    return this.name;
  }

  set name(value: string) {
    this.name = value;
  }

  get phone(): string {
    return this.phone;
  }

  set phone(value: string) {
    this.phone = value;
  }

  get address(): Address {
    return this.address;
  }

  set address(value: Address) {
    this.address = value;
  }

  get image(): string | undefined {
    return this.image;
  }

  set image(value: string | undefined) {
    this.image = value;
  }
}
