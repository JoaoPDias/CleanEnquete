import {Validation} from "../../protocols/validation";
import {MissingParamError} from "../../errors";

export class RequiredFieldValidation implements Validation {
    private _fieldName : string;

    constructor(fieldName : string) {
        this._fieldName = fieldName;
    }

    validate(input : any) : Error {
        if (!input[this._fieldName]) {
            return new MissingParamError(this._fieldName)
        }
        return null
    }

}