import {LoginController} from "./login";
import {LoginRequestBuilder} from "../../builders/login-request-builder";
import {badRequest} from "../../helpers/http-helper";
import {MissingParamError} from "../../errors";

interface SutTypes {
    sut : LoginController
}

const makeSut = () : SutTypes => {
    const sut = new LoginController()
    return {
        sut
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

});