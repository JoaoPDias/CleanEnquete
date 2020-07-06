import {SignUpController} from "./signup";
import {InvalidParamError, MissingParamError, ServerError} from "../../errors";
import {
    AccountModel,
    AccountModelBuilder,
    AddAccount,
    AddAccountModel,
    AddAccountRequestBuilder,
    EmailValidator,
    Validation
} from "./signup-protocols";
import {badRequest, serverError, success} from "../../helpers/http-helper";


const httpRequestDefault = {body: AddAccountRequestBuilder.new().build()}
const makeEmailValidator = () : EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email : string) : boolean {
            return true;
        }
    }

    return new EmailValidatorStub();
}

const makeAddAccount = () : AddAccount => {
    class AddAccountStub implements AddAccount {
        async add(account : AddAccountModel) : Promise<AccountModel> {
            return Promise.resolve(AccountModelBuilder.new().build());
        }
    }

    return new AddAccountStub();
}

const makeValidation = () : Validation => {
    class ValidationStub implements Validation {
        validate(input : any) : Error {
            return null
        }
    }

    return new ValidationStub()
}

interface SutTypes {
    sut : SignUpController
    emailValidatorStub : EmailValidator
    addAccountStub : AddAccount
    validationStub : Validation
}


const makeSut = () : SutTypes => {
    const emailValidatorStub = makeEmailValidator();
    const addAccountStub = makeAddAccount();
    const validationStub = makeValidation();
    const sut = new SignUpController(emailValidatorStub, addAccountStub, validationStub);
    return {sut, emailValidatorStub, addAccountStub, validationStub}
};
describe('SignUp Controller', () => {
     test('Should return 400 if an invalid email is provided', async () => {
         const {sut, emailValidatorStub} = makeSut();
         jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
         const httpRequest = {
             body: AddAccountRequestBuilder.new().email("invalid_email@mail.com").build()
         }
         const httpResponse = await sut.handle(httpRequest)
         expect(httpResponse).toStrictEqual(badRequest(new InvalidParamError('email')))
     });

    test('Should call EmailValidator with correct email', () => {
        const {sut, emailValidatorStub} = makeSut();
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
        sut.handle(httpRequestDefault)
        expect(isValidSpy).toHaveBeenCalledWith(httpRequestDefault.body.email);
    })

    test('Should return 500 if an EmailValidator throws', async () => {
        const {sut, emailValidatorStub} = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
            throw new Error();
        });
        const httpRequest = {
            body: AddAccountRequestBuilder.new().email("invalid_email@mail.com").build()
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toStrictEqual(serverError(new ServerError(null)))
    });

    test('Should call AddAccount with correct values', () => {
        const {sut, addAccountStub} = makeSut();
        const addSpy = jest.spyOn(addAccountStub, 'add');
        sut.handle(httpRequestDefault)
        expect(addSpy).toHaveBeenCalledWith({
            name: httpRequestDefault.body.name,
            email: httpRequestDefault.body.email,
            password: httpRequestDefault.body.password
        });
    })

    test('Should return 500 if an AddAccount throws', async () => {
        const {sut, addAccountStub} = makeSut();
        jest.spyOn(addAccountStub, 'add').mockImplementation(async () => {
            return Promise.reject(new Error());
        });
        const httpRequest = {
            body: AddAccountRequestBuilder.new().email("invalid_email@mail.com").build()
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toStrictEqual(serverError(new ServerError(null)))
    });

    test('Should return 200 if valid data is provided', async () => {
        const {sut} = makeSut();
        const httpResponse = await sut.handle(httpRequestDefault)
        expect(httpResponse).toStrictEqual(success(AccountModelBuilder.new().build()))
    })
    test('Should call Validation with correct value', () => {
        const {sut, validationStub} = makeSut();
        const validateSpy = jest.spyOn(validationStub, 'validate');
        sut.handle(httpRequestDefault)
        expect(validateSpy).toHaveBeenCalledWith(httpRequestDefault.body);
    })

    test('Should return 400 if Validation returns an error', async () => {
        const {sut, validationStub} = makeSut();
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
        const httpResponse = await sut.handle(httpRequestDefault)
        expect(httpResponse).toStrictEqual(badRequest(new MissingParamError('any_field')))
    })

})