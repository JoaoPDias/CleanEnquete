import {Controller, HttpRequest, HttpResponse, Validation} from "./add-survey-controller-protocols";

export class AddSurveyController implements Controller {
    constructor(private readonly _validation : Validation) {
    }

    async handle(httpRequest : HttpRequest) : Promise<HttpResponse> {
        this._validation.validate(httpRequest.body)
        return Promise.resolve(null);
    }

}