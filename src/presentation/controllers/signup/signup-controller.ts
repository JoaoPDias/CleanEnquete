import {
    AddAccount,
    Authentication,
    Controller,
    HttpRequest,
    HttpResponse,
    Validation
} from "./signup-controller-protocols";
import {badRequest, serverError, success} from "../../helpers/http/http-helper";

export class SignUpController implements Controller {

    constructor(private readonly _addAccount : AddAccount, private readonly _validation : Validation, private readonly _authentication : Authentication) {
    }

    async handle(httpRequest : HttpRequest) : Promise<HttpResponse> {
        try {
            const error = this._validation.validate(httpRequest.body)
            if (error) {
                return badRequest(error)
            }
            const {name, email, password} = httpRequest.body
            await this._addAccount.add({
                name,
                email,
                password
            })
            const accessToken = await this._authentication.auth({email, password})
            return success({accessToken})
        } catch (e) {
            return serverError(e)
        }
    }
}