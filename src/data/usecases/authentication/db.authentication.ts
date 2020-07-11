import {Authentication, AuthenticationModel} from "../../../domain/usecases/authentication";
import {LoadAccountByEmailRepository} from "../../protocols/db/load-account-by-email-repository";
import {HashComparer} from "../../protocols/criptography/hash-comparer";


export class DbAuthentication implements Authentication {
    private _loadAccountByEmailRepository : LoadAccountByEmailRepository;
    private _hashComparer : HashComparer;

    constructor(loadAccountByEmailRepository : LoadAccountByEmailRepository, hashComparer : HashComparer) {
        this._loadAccountByEmailRepository = loadAccountByEmailRepository;
        this._hashComparer = hashComparer;
    }

    async auth(authentication : AuthenticationModel) : Promise<string> {
        const account = await this._loadAccountByEmailRepository.load(authentication.email)
        if (account) {
            await this._hashComparer.compare(authentication.password, account.password)
        }
        return null
    }
}