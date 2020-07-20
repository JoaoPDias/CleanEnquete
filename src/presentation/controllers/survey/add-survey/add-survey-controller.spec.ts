import {AddSurveyRequestBuilder} from "../../../builders/add-survey-request-builder";
import {AddSurveyController} from "./add-survey.controller";
import {HttpRequest, Validation} from "../../../protocols";

const makeValidationStub = () : Validation => {
    class ValidationStub implements Validation {
        validate(input : any) : Error {
            return null
        }
    }

    return new ValidationStub()
}

describe('AddSurvey controller', () => {
    const httpRequestDefault : HttpRequest = {body: AddSurveyRequestBuilder.new().build()}
    test('Should call Validation with correct values', async () => {
        const validationStub = makeValidationStub()
        const validateSpy = jest.spyOn(validationStub, 'validate')
        const sut = new AddSurveyController(validationStub);
        await sut.handle(httpRequestDefault)
        expect(validateSpy).toHaveBeenCalledWith(httpRequestDefault.body)
    });
});