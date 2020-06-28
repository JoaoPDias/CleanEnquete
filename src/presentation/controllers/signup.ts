import {HttpRequest, HttpResponse} from "../protocols/http";
import {MissingParamError} from "../errors/missing-param-error";
import {badRequest, serverError} from "../helpers/http-helper";
import {Controller} from "../protocols/controller";
import {EmailValidator} from "../protocols/email-validator";
import {InvalidParamError} from "../errors/invalid-param-error";
import {ServerError} from "../errors/server-error";

export class SignUpController implements Controller {
    private readonly _emailValidator: EmailValidator;

    constructor(emailValidator: EmailValidator) {
        this._emailValidator = emailValidator;

    }

    handle(httpRequest: HttpRequest): HttpResponse {
        try {
            const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
            for (const field of requiredFields) {
                if (!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }
            const isValid = this._emailValidator.isValid(httpRequest.body.email)
            if (!isValid) {
                return badRequest(new InvalidParamError('email'))
            }
        } catch (e) {
            return serverError(new ServerError())
        }
    }
}