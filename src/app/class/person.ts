import { Address } from "./address";
import { Rol } from "./rol";


export class Person {
  private _budgetId?: number | undefined;
  private _email?: string | undefined;
  private _password?: string | undefined;
  private _rol?: Rol | undefined;

  constructor(
    id: number,
    name: string,
    lastname: string,
    phone: string,
    address: Address,
    image?: string
  ) {
    this.id = id;
    this.name = name;
    this.lastname = lastname;
    this.phone = phone;
    this.address = address;
    this.image = image;
  }

  static fromJson(json: any): Person {
    return new Person(json.id, json.name, json.phone, json.address, json.image);
  }

  public get rol(): Rol | undefined {
    return this._rol;
  }

  public set rol(value: Rol | undefined) {
    this._rol = value;
  }

  public get password(): string | undefined {
    return this._password;
  }

  public set password(value: string | undefined) {
    this._password = value;
  }

  public get email(): string | undefined {
    return this._email;
  }

  public set email(value: string | undefined) {
    this._email = value;
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

  get lastname(): string {
    return this.lastname;
  }

  set lastname(value: string) {
    this.lastname = value;
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
