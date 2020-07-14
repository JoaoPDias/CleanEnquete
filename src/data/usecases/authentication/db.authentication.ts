import {
    Authentication,
    AuthenticationModel,
    Encrypter,
    HashComparer,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository
} from "./db-authentication-protocols";

export class DbAuthentication implements Authentication {

    constructor(private readonly _loadAccountByEmailRepository : LoadAccountByEmailRepository, private readonly _hashComparer : HashComparer, private readonly _tokenGenerator : Encrypter, private readonly _updateAccessTokenRepository : UpdateAccessTokenRepository) {
    }

    async auth(authentication : AuthenticationModel) : Promise<string> {
        const account = await this._loadAccountByEmailRepository.loadByEmail(authentication.email)
        if (account) {
            const isValid = await this._hashComparer.compare(authentication.password, account.password)
            if (isValid) {
                const accessToken = await this._tokenGenerator.encrypt(account.id)
                await this._updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
                return accessToken
            }
        }
        return null
    }

}