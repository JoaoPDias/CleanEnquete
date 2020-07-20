import {AddSurveyRequestBuilder} from "../../../builders/add-survey-request-builder";
import {AddSurveyController} from "./add-survey.controller";
import {HttpRequest, Validation} from "../../../protocols";
import {badRequest} from "../../../helpers/http/http-helper";

const makeValidationStub = () : Validation => {
    class ValidationStub implements Validation {
        validate(input : any) : Error {
            return null
        }
    }

    return new ValidationStub()
}

interface SutTypes {
    sut : AddSurveyController
    validationStub : Validation
}

const makeSut = () : SutTypes => {
    const validationStub = makeValidationStub()
    const sut = new AddSurveyController(validationStub)
    return {sut, validationStub}
}
describe('AddSurvey controller', () => {
    const httpRequestDefault : HttpRequest = {body: AddSurveyRequestBuilder.new().build()}
    test('Should call Validation with correct values', async () => {
        const {sut, validationStub} = makeSut()
        const validateSpy = jest.spyOn(validationStub, 'validate')
        await sut.handle(httpRequestDefault)
        expect(validateSpy).toHaveBeenCalledWith(httpRequestDefault.body)
    });
    test('Should return 400 if Validation fails', async () => {
        const {sut, validationStub} = makeSut()
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
        const httpResponse = await sut.handle(httpRequestDefault)
        expect(httpResponse).toStrictEqual(badRequest(new Error()))
    });
});