import {Validation} from "../../presentation/protocols";
import {InvalidParamError} from "../../presentation/errors";

export class CompareFieldsValidation implements Validation {
    private _fieldName : string;
    private _fieldToCompareName : string;

    constructor(fieldName : string, fieldToCompareName : string) {
        this._fieldName = fieldName;
        this._fieldToCompareName = fieldToCompareName;
    }

    validate(input : any) : Error {
        if (input[this._fieldName] !== input[this._fieldToCompareName]) {
            return new InvalidParamError(this._fieldToCompareName)
        }
        return null
    }

}