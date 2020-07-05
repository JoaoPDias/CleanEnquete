import {Authentication, Controller, EmailValidator, HttpRequest, HttpResponse} from "./login-protocols";
import {badRequest, serverError, success, unauthorized} from "../../helpers/http-helper";
import {InvalidParamError, MissingParamError} from "../../errors";


export class LoginController implements Controller {
    private _emailValidator : EmailValidator;
    private _authentication : Authentication;

    constructor(emailValidator : EmailValidator, authenticationStub : Authentication) {
        this._emailValidator = emailValidator
        this._authentication = authenticationStub;
    }

    async handle(httpRequest : HttpRequest) : Promise<HttpResponse> {
        try {
            const requiredFields = ['email', 'password']
            for (const field of requiredFields) {
                if (!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }
            const {email, password} = httpRequest.body
            const isValid = this._emailValidator.isValid(email)
            if (!isValid) {
                return badRequest(new InvalidParamError('email'))
            }
            const accessToken = await this._authentication.auth(email, password)
            if (!accessToken) {
                return unauthorized()
            }
            return success({accessToken: accessToken})
        } catch (e) {
            return serverError(e)
        }

    }
}