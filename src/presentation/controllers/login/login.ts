import {Controller, HttpRequest, HttpResponse} from "../../protocols";
import {badRequest, serverError} from "../../helpers/http-helper";
import {InvalidParamError, MissingParamError} from "../../errors";
import {EmailValidator} from "../../protocols/email-validator";

export class LoginController implements Controller {
    private _emailValidator : EmailValidator;

    constructor(emailValidator : EmailValidator) {
        this._emailValidator = emailValidator
    }

    async handle(httpRequest : HttpRequest) : Promise<HttpResponse> {
        try {
            const requiredFields = ['email', 'password']
            for (const field of requiredFields) {
                if (!httpRequest.body[field]) {
                    return Promise.resolve(badRequest(new MissingParamError(field)))
                }
            }
            const {email, password} = httpRequest.body
            const isValid = this._emailValidator.isValid(email)
            if (!isValid) {
                return badRequest(new InvalidParamError('email'))
            }
        } catch (e) {
            return serverError(e)
        }

    }
}