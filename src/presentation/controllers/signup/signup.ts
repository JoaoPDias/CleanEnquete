import {AddAccount, Controller, HttpRequest, HttpResponse, Validation} from "./signup-protocols";
import {badRequest, serverError, success} from "../../helpers/http-helper";

export class SignUpController implements Controller {
    private readonly _addAccount : AddAccount;
    private readonly _validation : Validation;

    constructor(addAccount : AddAccount, validation : Validation) {
        this._addAccount = addAccount;
        this._validation = validation;
    }

    async handle(httpRequest : HttpRequest) : Promise<HttpResponse> {
        try {
            const error = this._validation.validate(httpRequest.body)
            if (error) {
                return badRequest(error)
            }
            const {name, email, password} = httpRequest.body
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