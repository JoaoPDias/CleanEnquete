import {SignUpController} from "../../../presentation/controllers/signup/signup-controller";
import {DbAddAccount} from "../../../data/usecases/add-account/db-add-account";
import {BCryptAdapter} from "../../../infra/criptography/bcrypt-adapter/bcrypt-adapter";
import {AccountMongoRepository} from "../../../infra/db/mongodb/account/account-mongo-repository";
import {Controller} from "../../../presentation/protocols";
import {LogControllerDecorator} from "../../decorators/log";
import {LogMongoRepository} from "../../../infra/db/mongodb/log/log-mongo-repository";
import {makeSignUpValidation} from "./signup-validation-factory";


export const makeSignUpController = () : Controller => {
    const salt = 12
    const bCryptAdapter = new BCryptAdapter(salt);
    const addAccountRepository = new AccountMongoRepository()
    const dbAddAccount = new DbAddAccount(bCryptAdapter, addAccountRepository)
    let signUpController = new SignUpController(dbAddAccount, makeSignUpValidation(), authentication)
    const logErrorRepository = new LogMongoRepository()
    return new LogControllerDecorator(signUpController, logErrorRepository)
}