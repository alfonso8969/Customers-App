import { Roles } from "./roles";

export class Rol {

    private _type: Roles;

    constructor(type: Roles) {
        this._type = type;
    }

    public get type(): string {
        return this._type.toString();
    }

    public set type(value: Roles) {
        this._type = value;
    }

}
