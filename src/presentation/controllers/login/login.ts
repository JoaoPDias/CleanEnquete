import {Controller, HttpRequest, HttpResponse} from "../../protocols";
import {badRequest, serverError} from "../../helpers/http-helper";
import {InvalidParamError, MissingParamError} from "../../errors";
import {EmailValidator} from "../../protocols/email-validator";
import {Authentication} from "../../../domain/usecases/authentication";

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
            await this._authentication.auth(email, password)
        } catch (e) {
            return serverError(e)
        }

    }
}