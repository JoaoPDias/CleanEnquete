import {ValidationComposite} from "./validation-composite";
import {MissingParamError} from "../../errors";
import {Validation} from "./validation";

const makeRequiredFieldStub = () : Validation => {
    class RequiredFieldStub implements Validation {
        validate(input : any) : Error {
            return undefined;
        }

    }

    return new RequiredFieldStub()
}

interface SutTypes {
    sut : ValidationComposite
    requiredFieldStub : Validation
}

const makeSut = () : SutTypes => {
    const requiredFieldStub = makeRequiredFieldStub()
    const sut = new ValidationComposite([requiredFieldStub])
    return {sut, requiredFieldStub}
}
describe('Validation Composite', () => {
    test('Should return an error if any validation fails', () => {
        const {sut, requiredFieldStub} = makeSut()
        jest.spyOn(requiredFieldStub, 'validate').mockReturnValueOnce(new MissingParamError('name'))
        const error = sut.validate({field: 'any_value'})
        expect(error).toEqual(new MissingParamError('name'))
    });
});