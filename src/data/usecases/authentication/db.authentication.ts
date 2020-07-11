import {Authentication, AuthenticationModel} from "../../../domain/usecases/authentication";
import {LoadAccountByEmailRepository} from "../../protocols/db/load-account-by-email.repository";

export class DbAuthentication implements Authentication {
    private _loadAccountByEmailRepository : LoadAccountByEmailRepository;

    constructor(loadAccountByEmailRepository : LoadAccountByEmailRepository) {
        this._loadAccountByEmailRepository = loadAccountByEmailRepository;
    }

    async auth(authentication : AuthenticationModel) : Promise<string> {
        await this._loadAccountByEmailRepository.load(authentication.email)
        return null
    }
}