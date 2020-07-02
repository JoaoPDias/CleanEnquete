import {SignUpController} from "../../presentation/controllers/signup/signup";
import {EmailValidatorAdapter} from "../../utils/email-validator-adapter";
import {DbAddAccount} from "../../data/usecases/add-account/db-add-account";
import {BCryptAdapter} from "../../infra/criptography/bcrypt-adapter";
import {AccountMongoRepository} from "../../infra/db/mongodb/account-repository/account";
import {Controller} from "../../presentation/protocols";
import {LogControllerDecorator} from "../decorators/log";


export const makeSignUpController = () : Controller => {
    const emailValidatorAdapter = new EmailValidatorAdapter()
    const salt = 12
    const bCryptAdapter = new BCryptAdapter(salt);
    const addAccountRepository = new AccountMongoRepository()
    const dbAddAccount = new DbAddAccount(bCryptAdapter, addAccountRepository)
    let signUpController = new SignUpController(emailValidatorAdapter, dbAddAccount)
    return new LogControllerDecorator(signUpController)
}