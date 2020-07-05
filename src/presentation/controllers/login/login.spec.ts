import {LoginController} from "./login";
import {LoginRequestBuilder} from "../../builders/login-request-builder";
import {badRequest} from "../../helpers/http-helper";
import {MissingParamError} from "../../errors";

describe('Login Controller', () => {
    test('Should return 400 if no email is provided', async () => {
        const sut = new LoginController()
        const httpRequest = {
            body: LoginRequestBuilder.new().email("").build()
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toStrictEqual(badRequest(new MissingParamError('email')))
    })

});