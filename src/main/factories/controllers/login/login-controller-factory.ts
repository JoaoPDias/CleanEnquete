import {Controller} from "../../../../presentation/protocols";
import {LogControllerDecorator} from "../../../decorators/log";
import {LogMongoRepository} from "../../../../infra/db/mongodb/log/log-mongo-repository";
import {makeLoginValidation} from "./login-validation-factory";
import {LoginController} from "../../../../presentation/controllers/login/login-controller";
import {makeDbAuthentication} from "../../usecases/db-authentication-factory";

export const makeLoginController = () : Controller => {
    let loginController = new LoginController(makeDbAuthentication(), makeLoginValidation())
    const logErrorRepository = new LogMongoRepository()
    return new LogControllerDecorator(loginController, logErrorRepository)
}