import {Authentication, Controller, HttpRequest, HttpResponse, Validation} from "./login-controller-protocols";
import {badRequest, serverError, success, unauthorized} from "../../helpers/http/http-helper";


export class LoginController implements Controller {

    constructor(private readonly _authentication : Authentication, private readonly _validation : Validation) {
    }

    async handle(httpRequest : HttpRequest) : Promise<HttpResponse> {
        try {
            const error = this._validation.validate(httpRequest.body)
            if (error) {
                return badRequest(error)
            }
            const {email, password} = httpRequest.body
            const accessToken = await this._authentication.auth({email, password})
            if (!accessToken) {
                return unauthorized()
            }
            return success({accessToken: accessToken})
        } catch (e) {
            console.error(e)
            return serverError(e)
        }

    }
}