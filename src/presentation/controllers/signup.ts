import {Controller, EmailValidator, HttpRequest, HttpResponse} from "../protocols";
import {InvalidParamError, MissingParamError} from "../errors";
import {badRequest, serverError} from "../helpers/http-helper";
import {AddAccount} from "../../domain/usecases/add-account";

export class SignUpController implements Controller {
    private readonly _emailValidator : EmailValidator;
    private _addAccountStub : AddAccount;

    constructor(emailValidator : EmailValidator, addAccountStub : AddAccount) {
        this._emailValidator = emailValidator;
        this._addAccountStub = addAccountStub;
    }

    handle(httpRequest: HttpRequest): HttpResponse {
        try {
            const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
            for (const field of requiredFields) {
                if (!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }
            const {name, email, password, passwordConfirmation} = httpRequest.body
            if (password !== passwordConfirmation) {
                return badRequest(new InvalidParamError("passwordConfirmation"))
            }
            const isValid = this._emailValidator.isValid(email)
            if (!isValid) {
                return badRequest(new InvalidParamError('email'))
            }
            this._addAccountStub.add({
                name,
                email,
                password
            })
        } catch (e) {
            return serverError()
        }
    }
}