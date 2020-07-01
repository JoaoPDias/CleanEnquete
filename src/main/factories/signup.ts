import {SignUpController} from "../../presentation/controllers/signup/signup";
import {EmailValidatorAdapter} from "../../utils/email-validator-adapter";
import {DbAddAccount} from "../../data/usecases/add-account/db-add-account";
import {BCryptAdapter} from "../../infra/criptography/bcrypt-adapter";
import {AccountMongoRepository} from "../../infra/db/mongodb/account-repository/accountMongoRepository";

export const makeSignUpController = () : SignUpController => {
    const emailValidatorAdapter = new EmailValidatorAdapter()
    const salt = 12
    const bCryptAdapter = new BCryptAdapter(salt);
    const addAccountRepostitory = new AccountMongoRepository()
    const dbAddAccount = new DbAddAccount(bCryptAdapter, addAccountRepostitory)
    return new SignUpController(emailValidatorAdapter, dbAddAccount)
}