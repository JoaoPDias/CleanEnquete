import {LoginController} from "./login";
import {LoginRequestBuilder} from "../../builders/login-request-builder";
import {badRequest} from "../../helpers/http-helper";
import {MissingParamError} from "../../errors";
import {EmailValidator} from "../../protocols/email-validator";

const makeEmailValidator = () : EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email : string) : boolean {
            return true;
        }

    }

    return new EmailValidatorStub()
}
interface SutTypes {
    sut : LoginController
    emailValidatorStub : EmailValidator
}

const makeSut = () : SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const sut = new LoginController(emailValidatorStub)
    return {
        sut,
        emailValidatorStub
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

});