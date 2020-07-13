import {Authentication, AuthenticationModel} from "../../../domain/usecases/authentication";
import {LoadAccountByEmailRepository} from "../../protocols/db/load-account-by-email-repository";
import {HashComparer} from "../../protocols/criptography/hash-comparer";
import {TokenGenerator} from "../../protocols/criptography/token-generator";


export class DbAuthentication implements Authentication {
    private _loadAccountByEmailRepository : LoadAccountByEmailRepository;
    private _hashComparer : HashComparer;
    private _tokenGenerator : TokenGenerator;

    constructor(loadAccountByEmailRepository : LoadAccountByEmailRepository, hashComparer : HashComparer, tokenGenerator : TokenGenerator) {
        this._loadAccountByEmailRepository = loadAccountByEmailRepository;
        this._hashComparer = hashComparer;
        this._tokenGenerator = tokenGenerator;
    }

    async auth(authentication : AuthenticationModel) : Promise<string> {
        const account = await this._loadAccountByEmailRepository.load(authentication.email)
        if (account) {
            await this._hashComparer.compare(authentication.password, account.password)
            await this._tokenGenerator.generate(account.id)
        }
        return null
    }
}