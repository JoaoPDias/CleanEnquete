import {RequiredFieldValidation} from "./required-field-validation";
import {MissingParamError} from "../../errors";

describe('Required Field Validation', () => {
    test('Should return a MissingParamError if validation fails', () => {
        const sut = new RequiredFieldValidation('field')
        const error = sut.validate({name: 'any_name'})
        expect(error).toStrictEqual(new MissingParamError('field'))
    });
});