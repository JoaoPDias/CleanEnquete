import {ValidationComposite} from "./validation-composite";
import {InvalidParamError, MissingParamError} from "../../errors";
import {Validation} from "./validation";

const makeValidationStub = () : Validation => {
    class ValidationStub implements Validation {
        validate(input : any) : Error {
            return null;
        }

    }

    return new ValidationStub()
}

interface SutTypes {
    sut : ValidationComposite
    validationStubs : Validation[]
}

const makeSut = () : SutTypes => {
    const validationStubs = [makeValidationStub(), makeValidationStub()]
    const sut = new ValidationComposite(validationStubs)
    return {sut, validationStubs}
}
describe('Validation Composite', () => {
    test('Should return an error if any validation fails', () => {
        const {sut, validationStubs} = makeSut()
        jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('name'))
        const error = sut.validate({field: 'any_value'})
        expect(error).toEqual(new MissingParamError('name'))
    });
    test('Should return first error if more than one validation fails', () => {
        const {sut, validationStubs} = makeSut()
        jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new InvalidParamError('email'))
        jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('password'))
        const error = sut.validate({field: 'any_value'})
        expect(error).toEqual(new InvalidParamError('email'))
    });
    test('Should not return error if validation succeeds', () => {
        const {sut} = makeSut()
        const error = sut.validate({field: 'any_value'})
        expect(error).toBeFalsy
    });
});