import {AddAccount} from "../../../domain/usecases/add-account";
import {BCryptAdapter} from "../../../infra/criptography/bcrypt-adapter/bcrypt-adapter";
import {AccountMongoRepository} from "../../../infra/db/mongodb/account/account-mongo-repository";
import {DbAddAccount} from "../../../data/usecases/add-account/db-add-account";

export const makeDbAddAccount = () : AddAccount => {
    const salt = 12
    const bCryptAdapter = new BCryptAdapter(salt);
    const accountMongoRepository = new AccountMongoRepository()
    return new DbAddAccount(bCryptAdapter, accountMongoRepository, accountMongoRepository)
}