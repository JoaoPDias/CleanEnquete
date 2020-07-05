import {Controller, HttpRequest, HttpResponse} from "../../protocols";
import {badRequest} from "../../helpers/http-helper";
import {MissingParamError} from "../../errors";

export class LoginController implements Controller {
    async handle(httpRequest : HttpRequest) : Promise<HttpResponse> {
        const requiredFields = ['email', 'password']
        for (const field of requiredFields) {
            if (!httpRequest.body[field]) {
                return Promise.resolve(badRequest(new MissingParamError(field)))
            }
        }
    }
}