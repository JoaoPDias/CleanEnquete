import {Validation} from "./validation";

export class ValidationComposite implements Validation {
    private readonly _validations : Validation[];

    constructor(validations : Validation[]) {
        this._validations = validations;
    }

    validate(input : any) : Error {
        this._validations.forEach((validation) => {
            const error = validation.validate(input)
            if (error) {
                return error
            }
        })
        return null
    }

}