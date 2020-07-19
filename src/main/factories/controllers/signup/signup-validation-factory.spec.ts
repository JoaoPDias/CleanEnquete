import {makeSignUpValidation} from "./signup-validation-factory";
import {Validation} from "../../../../presentation/protocols";
import {EmailValidator} from "../../../../validation/protocols/email-validator";
import {
    CompareFieldsValidation,
    EmailValidation,
    RequiredFieldValidation,
    ValidationComposite
} from "../../../../validation/validators";

const makeEmailValidator = () : EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email : string) : boolean {
            return true;
        }
    }

    return new EmailValidatorStub();
}
jest.mock('../../../../validation/validators/validation-composite')
describe('SignUpValidator', () => {
    test('Should call ValidationComposite with all validations', () => {
        makeSignUpValidation()
        const validations : Validation[] = []
        for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
            validations.push(new RequiredFieldValidation(field))
        }
        validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
        validations.push(new EmailValidation('email', makeEmailValidator()))
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    });
});
