export class Rol {
    
    private _type: string = 'admin | user';
    
    constructor(type: string) {
        this.type = type;
    }
    
    public get type(): string {
        return this._type;
    }
    
    public set type(value: string) {
        this._type = value;
    }

}