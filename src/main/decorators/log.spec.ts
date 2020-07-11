import {Controller, HttpRequest, HttpResponse} from "../../presentation/protocols";
import {LogControllerDecorator} from "./log";
import {serverError} from "../../presentation/helpers/http/http-helper";
import {LogErrorRepository} from "../../data/protocols/log-error-repository";
import {AddAccountRequestBuilder} from "../../presentation/builders/add-account-request-builder";

const makeController = () : Controller => {
    class ControllerStub implements Controller {
        async handle(httpRequest : HttpRequest) : Promise<HttpResponse> {
            const httpResponse = {
                statusCode: 200,
                body: {
                    name: 'Rodrigo'
                }
            }
            return Promise.resolve(httpResponse)
        }
    }

    return new ControllerStub()
}
const makeLogErrorRepository = () : LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository {
        async logError(error : string) : Promise<void> {
            return Promise.resolve()
        }
    }

    return new LogErrorRepositoryStub()
}
const makeFakeServerError = () : HttpResponse => {
    const fakeError = new Error()
    fakeError.stack = 'any stack'
    return serverError(fakeError)
}

interface SutTypes {
    sut : LogControllerDecorator
    controllerStub : Controller
    logErrorRepositoryStub : LogErrorRepository
}

const makeSut = () : SutTypes => {
    const controllerStub = makeController()
    const logErrorRepositoryStub = makeLogErrorRepository()
    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
    return {sut, controllerStub, logErrorRepositoryStub}
}
describe('LogController Decorator', () => {
    test('Should call controller handle', async () => {
        const {sut, controllerStub} = makeSut()
        const handleSpy = jest.spyOn(controllerStub, 'handle')
        const httpRequest = {
            body: AddAccountRequestBuilder.new().build()
        }
        await sut.handle(httpRequest)
        expect(handleSpy).toHaveBeenCalledWith(httpRequest)
    })
    test('Should return the same result of the controller', async () => {
        const {sut} = makeSut()
        const httpRequest = {
            body: AddAccountRequestBuilder.new().build()
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual({statusCode: 200, body: {name: 'Rodrigo'}})
    })
    test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
        const {sut, controllerStub, logErrorRepositoryStub} = makeSut()

        jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(makeFakeServerError()))
        const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
        const httpRequest = {
            body: AddAccountRequestBuilder.new().build()
        }
        await sut.handle(httpRequest)
        expect(logSpy).toHaveBeenCalledWith('any stack')
    })
});