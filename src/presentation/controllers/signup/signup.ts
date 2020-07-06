import {AddAccount, Controller, EmailValidator, HttpRequest, HttpResponse, Validation} from "./signup-protocols";
import {InvalidParamError} from "../../errors";
import {badRequest, serverError, success} from "../../helpers/http-helper";

export class SignUpController implements Controller {
    private readonly _emailValidator : EmailValidator;
    private readonly _addAccount : AddAccount;
    private readonly _validation : Validation;

    constructor(emailValidator : EmailValidator, addAccount : AddAccount, validation : Validation) {
        this._emailValidator = emailValidator;
        this._addAccount = addAccount;
        this._validation = validation;
    }

    async handle(httpRequest : HttpRequest) : Promise<HttpResponse> {
        try {
            const error = this._validation.validate(httpRequest.body)
            if (error) {
                return badRequest(error)
            }
            const {name, email, password, passwordConfirmation} = httpRequest.body

            const isValid = this._emailValidator.isValid(email)
            if (!isValid) {
                return badRequest(new InvalidParamError('email'))
            }
            const account = await this._addAccount.add({
                name,
                email,
                password
            })
            return success(account)
        } catch (e) {
            return serverError(e)
        }
    }
}