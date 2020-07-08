import {LoginController} from "./login";
import {badRequest, serverError, success, unauthorized} from "../../helpers/http-helper";
import {MissingParamError} from "../../errors";
import {Authentication, LoginRequestBuilder, Validation} from "./login-protocols";

const httpRequestDefault = {body: LoginRequestBuilder.new().build()}


const makeAuthentication = () : Authentication => {
    class AuthenticationStub implements Authentication {
        async auth(email : string, password : string) : Promise<string> {
            return Promise.resolve('valid_token');
        }

    }

    return new AuthenticationStub()
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
    sut : LoginController
    authenticationStub : Authentication
    validationStub : Validation
}

const makeSut = () : SutTypes => {
    const validationStub = makeValidation()
    const authenticationStub = makeAuthentication()
    const sut = new LoginController(authenticationStub, validationStub)
    return {
        sut,
        validationStub,
        authenticationStub
    }
}
describe('Login Controller', () => {
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
    test('Should return 500 if Authentication throws', async () => {
        const {sut, authenticationStub} = makeSut()
        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.reject(new Error()))
        const httpResponse = await sut.handle(httpRequestDefault)
        expect(httpResponse).toStrictEqual(serverError(new Error()))
    });
    test('Should return 200 if valid credentials are provided', async () => {
        const {sut} = makeSut()
        const httpResponse = await sut.handle(httpRequestDefault)
        expect(httpResponse).toStrictEqual(success({accessToken: 'valid_token'}))
    });
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

});