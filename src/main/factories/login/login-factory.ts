import {BCryptAdapter} from "../../../infra/criptography/bcrypt-adapter/bcrypt-adapter";
import {AccountMongoRepository} from "../../../infra/db/mongodb/account/account-mongo-repository";
import {Controller} from "../../../presentation/protocols";
import {LogControllerDecorator} from "../../decorators/log";
import {LogMongoRepository} from "../../../infra/db/mongodb/log/log-mongo-repository";
import {makeLoginValidation} from "./login-validation-factory";
import {LoginController} from "../../../presentation/controllers/login/login-controller";
import {DbAuthentication} from "../../../data/usecases/authentication/db.authentication";
import {JwtAdapter} from "../../../infra/criptography/jwt-adapter/jwt.adapter";
import Environment from "../../config/env";

export const makeLoginController = () : Controller => {
    const salt = 12
    const bCryptAdapter = new BCryptAdapter(salt)
    const jwtAdapter = new JwtAdapter(Environment.jwtSecret)
    const accountMongoRepository = new AccountMongoRepository()
    const dbAuthentication = new DbAuthentication(accountMongoRepository, bCryptAdapter, jwtAdapter, accountMongoRepository)
    let loginController = new LoginController(dbAuthentication, makeLoginValidation())
    const logErrorRepository = new LogMongoRepository()
    return new LogControllerDecorator(loginController, logErrorRepository)
}