import {Authentication, AuthenticationModel} from "../../../domain/usecases/authentication";
import {LoadAccountByEmailRepository} from "../../protocols/db/load-account-by-email-repository";
import {HashComparer} from "../../protocols/criptography/hash-comparer";
import {TokenGenerator} from "../../protocols/criptography/token-generator";
import {UpdateAccessTokenRepository} from "../../protocols/db/update-access-token-repository";


export class DbAuthentication implements Authentication {
    private _loadAccountByEmailRepository : LoadAccountByEmailRepository;
    private _hashComparer : HashComparer;
    private _tokenGenerator : TokenGenerator;
    private _updateAccessTokenRepository : UpdateAccessTokenRepository;

    constructor(loadAccountByEmailRepository : LoadAccountByEmailRepository, hashComparer : HashComparer, tokenGenerator : TokenGenerator, updateAccessTokenRepository : UpdateAccessTokenRepository) {
        this._loadAccountByEmailRepository = loadAccountByEmailRepository;
        this._hashComparer = hashComparer;
        this._tokenGenerator = tokenGenerator;
        this._updateAccessTokenRepository = updateAccessTokenRepository;
    }

    async auth(authentication : AuthenticationModel) : Promise<string> {
        const account = await this._loadAccountByEmailRepository.load(authentication.email)
        if (account) {
            const isValid = await this._hashComparer.compare(authentication.password, account.password)
            if (isValid) {
                const accessToken = await this._tokenGenerator.generate(account.id)
                await this._updateAccessTokenRepository.update(account.id, accessToken)
                return accessToken
            }
        }
        return null
    }

}