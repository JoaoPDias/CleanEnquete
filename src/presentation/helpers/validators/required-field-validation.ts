import {Validation} from "../../protocols/validation";
import {MissingParamError} from "../../errors";

export class RequiredFieldValidation implements Validation {

    constructor(private readonly _fieldName : string) {
    }

    validate(input : any) : Error {
        if (!input[this._fieldName]) {
            return new MissingParamError(this._fieldName)
        }
        return null
    }

}