import {SignUpController} from "./signup";
import {InvalidParamError, MissingParamError, ServerError} from "../../errors";
import {AccountModel, AddAccount, AddAccountModel, EmailValidator} from "./signup-protocols";
import {AddAccountRequestBuilder} from "../../builders/add-account-request-builder";
import {badRequest, serverError, success} from "../../helpers/http-helper";
import {AccountModelBuilder} from "../../builders/account-model-builder";


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

interface SutTypes {
    sut : SignUpController
    emailValidatorStub : EmailValidator
    addAccountStub : AddAccount
}

const makeSut = () : SutTypes => {
    const emailValidatorStub = makeEmailValidator();
    const addAccountStub = makeAddAccount();
    const sut = new SignUpController(emailValidatorStub, addAccountStub);
    return {sut, emailValidatorStub, addAccountStub}
};
describe('SignUp Controller', () => {
    test('Should return 400 if no name is provided', async () => {
        const {sut} = makeSut();
        const httpRequest = {body: AddAccountRequestBuilder.new().name("").build()}
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toStrictEqual(badRequest(new MissingParamError('name')))
    })

    test('Should return 400 if no email is provided', async () => {
        const {sut} = makeSut();
        const httpRequest = {
            body: AddAccountRequestBuilder.new().email("").build()
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toStrictEqual(badRequest(new MissingParamError('email')))
    })

    test('Should return 400 if no password is provided', async () => {
        const {sut} = makeSut();
        const httpRequest = {
            body: AddAccountRequestBuilder.new().password("").build()
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toStrictEqual(badRequest(new MissingParamError('password')))
    })

    test('Should return 400 if no passwordConfirmation is provided', async () => {
        const {sut} = makeSut();
        const httpRequest = {
            body: AddAccountRequestBuilder.new().passwordConfirmation("").build()
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toStrictEqual(badRequest(new MissingParamError('passwordConfirmation')))
    });

    test('Should return 400 if an invalid email is provided', async () => {
        const {sut, emailValidatorStub} = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const httpRequest = {
            body: AddAccountRequestBuilder.new().email("invalid_email@mail.com").build()
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toStrictEqual(badRequest(new InvalidParamError('email')))
    });

    test('Should return 400 if passwordConfirmation fails', async () => {
        const {sut} = makeSut();
        const httpRequest = {
            body: AddAccountRequestBuilder.new().passwordConfirmation("passworddiff").build()
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toStrictEqual(badRequest(new InvalidParamError('passwordConfirmation')))
    });
    test('Should call EmailValidator with correct email', () => {
        const validRequest = AddAccountRequestBuilder.new().build();
        const {sut, emailValidatorStub} = makeSut();
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
        const httpRequest = {
            body: validRequest
        }
        sut.handle(httpRequest)
        expect(isValidSpy).toHaveBeenCalledWith(validRequest.email);
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
        const validRequest = AddAccountRequestBuilder.new().build();
        const {sut, addAccountStub} = makeSut();
        const addSpy = jest.spyOn(addAccountStub, 'add');
        const httpRequest = {
            body: validRequest
        }
        sut.handle(httpRequest)
        expect(addSpy).toHaveBeenCalledWith({
            name: validRequest.name,
            email: validRequest.email,
            password: validRequest.password
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
        const httpRequest = {
            body: AddAccountRequestBuilder.new().build()
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toStrictEqual(success(AccountModelBuilder.new().build()))
    })
})