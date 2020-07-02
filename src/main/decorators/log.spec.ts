import {Controller, HttpRequest, HttpResponse} from "../../presentation/protocols";
import {LogControllerDecorator} from "./log";

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

interface SutTypes {
    sut : LogControllerDecorator
    controllerStub : Controller
}

const makeSut = () : SutTypes => {
    const controllerStub = makeController()
    const sut = new LogControllerDecorator(controllerStub)
    return {sut, controllerStub}
}
describe('LogController Decorator', () => {
    test('Should call controller handle', async () => {

        const {sut, controllerStub} = makeSut()
        const handleSpy = jest.spyOn(controllerStub, 'handle')
        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                name: 'Any Name',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        await sut.handle(httpRequest)
        expect(handleSpy).toHaveBeenCalledWith(httpRequest)
    })
    test('Should return the same result of the controller', async () => {
        const {sut} = makeSut()
        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                name: 'Any Name',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual({statusCode: 200, body: {name: 'Rodrigo'}})
    })
});