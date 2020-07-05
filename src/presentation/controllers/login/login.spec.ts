import {LoginController} from "./login";
import {LoginRequestBuilder} from "../../builders/login-request-builder";
import {badRequest, serverError, unauthorized} from "../../helpers/http-helper";
import {InvalidParamError, MissingParamError} from "../../errors";
import {EmailValidator} from "../../protocols/email-validator";
import {Authentication} from "../../../domain/usecases/authentication";

const httpRequestDefault = {body: LoginRequestBuilder.new().email('invalid_email@mail.com').build()}

const makeEmailValidator = () : EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email : string) : boolean {
            return true;
        }

    }

    return new EmailValidatorStub()
}

const makeAuthentication = () : Authentication => {
    class AuthenticationStub implements Authentication {
        async auth(email : string, password : string) : Promise<string> {
            return Promise.resolve('valid_token');
        }

    }

    return new AuthenticationStub()
}

interface SutTypes {
    sut : LoginController
    emailValidatorStub : EmailValidator
    authenticationStub : Authentication
}

const makeSut = () : SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const authenticationStub = makeAuthentication()
    const sut = new LoginController(emailValidatorStub, authenticationStub)
    return {
        sut,
        emailValidatorStub,
        authenticationStub
    }
}
describe('Login Controller', () => {
    test('Should return 400 if no email is provided', async () => {
        const {sut} = makeSut()
        const httpRequest = {
            body: LoginRequestBuilder.new().email("").build()
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toStrictEqual(badRequest(new MissingParamError('email')))
    })
    test('Should return 400 if no password is provided', async () => {
        const {sut} = makeSut()
        const httpRequest = {
            body: LoginRequestBuilder.new().password("").build()
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toStrictEqual(badRequest(new MissingParamError('password')))
    })
    test('Should call EmailValidator with correct email', async () => {
        const {sut, emailValidatorStub} = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        const loginRequest = LoginRequestBuilder.new().build()
        const httpRequest = {body: loginRequest}
        await sut.handle(httpRequest)
        expect(isValidSpy).toHaveBeenCalledWith(loginRequest.email)
    });
    test('Should return 400 if an invalid email is provided', async () => {
        const {sut, emailValidatorStub} = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const httpResponse = await sut.handle(httpRequestDefault)
        expect(httpResponse).toStrictEqual(badRequest(new InvalidParamError('email')))
    });
    test('Should return 500 if EmailValidator throws', async () => {
        const {sut, emailValidatorStub} = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })
        const httpResponse = await sut.handle({body: LoginRequestBuilder.new().build()})
        expect(httpResponse).toStrictEqual(serverError(new Error()))
    });
    test('Should call Authentication with correct values', async () => {
        const {sut, authenticationStub} = makeSut()
        const authSpy = jest.spyOn(authenticationStub, 'auth')
        await sut.handle(httpRequestDefault)
        expect(authSpy).toHaveBeenCalledWith(httpRequestDefault.body.email, httpRequestDefault.body.password)
    });
    test('Should return 401 if invalid credentials are provided', async () => {
        const {sut, authenticationStub} = makeSut()
        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.resolve(null))
        const httpResponse = await sut.handle(httpRequestDefault)
        expect(httpResponse).toStrictEqual(unauthorized())
    });
});