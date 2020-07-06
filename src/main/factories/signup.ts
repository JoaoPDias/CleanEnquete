import {SignUpController} from "../../presentation/controllers/signup/signup";
import {DbAddAccount} from "../../data/usecases/add-account/db-add-account";
import {BCryptAdapter} from "../../infra/criptography/bcrypt-adapter";
import {AccountMongoRepository} from "../../infra/db/mongodb/account-repository/account";
import {Controller} from "../../presentation/protocols";
import {LogControllerDecorator} from "../decorators/log";
import {LogMongoRepository} from "../../infra/db/mongodb/log-repository/log";
import {makeSignUpValidation} from "./signup-validation";


export const makeSignUpController = () : Controller => {
    const salt = 12
    const bCryptAdapter = new BCryptAdapter(salt);
    const addAccountRepository = new AccountMongoRepository()
    const dbAddAccount = new DbAddAccount(bCryptAdapter, addAccountRepository)
    let signUpController = new SignUpController(dbAddAccount, makeSignUpValidation())
    const logErrorRepository = new LogMongoRepository()
    return new LogControllerDecorator(signUpController, logErrorRepository)
}