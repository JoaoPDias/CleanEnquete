import {Validation} from "../../presentation/protocols";
import {MissingParamError} from "../../presentation/errors";

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