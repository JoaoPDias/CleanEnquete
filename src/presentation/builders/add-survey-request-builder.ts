import {AddSurveyRequest} from "./builders-models/add-survey/add-survey-request";

export class AddSurveyRequestBuilder {
    private readonly _addSurveyRequest : AddSurveyRequest;

    private constructor() {
        this._addSurveyRequest = {
            question: 'any_question',
            answers: [{
                image: 'any_image',
                answer: 'any_answer'
            }]
        }
    }

    static new() : AddSurveyRequestBuilder {
        return new AddSurveyRequestBuilder()
    }

    WithQuestion(question : string) : AddSurveyRequestBuilder {
        this._addSurveyRequest.question = question
        return this
    }

    WithAnswer(answer : { image : string, answer : string }) : AddSurveyRequestBuilder {
        this._addSurveyRequest.answers.push(answer)
        return this
    }

    build() : AddSurveyRequest {
        return this._addSurveyRequest
    }

}