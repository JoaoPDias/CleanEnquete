import {AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Hasher} from "./db-account-protocols";
import {LoadAccountByEmailRepository} from "../../protocols/db/load-account-by-email-repository";


export class DbAddAccount implements AddAccount {
    private readonly _hasher : Hasher;
    private readonly _addAccountRepository : AddAccountRepository;
    private _loadAccountByEmailRepository : LoadAccountByEmailRepository;

    constructor(hasher : Hasher, addAccountRepository : AddAccountRepository, loadAccountByEmailRepository : LoadAccountByEmailRepository) {
        this._hasher = hasher;
        this._addAccountRepository = addAccountRepository;
        this._loadAccountByEmailRepository = loadAccountByEmailRepository
    }

    async add(accountData : AddAccountModel) : Promise<AccountModel> {
        const existingAccount = await this._loadAccountByEmailRepository.loadByEmail(accountData.email);
        if (!existingAccount) {
            const hashedPassword = await this._hasher.hash(accountData.password)
            const account = await this._addAccountRepository.add(Object.assign(accountData, {password: hashedPassword}))
            return Promise.resolve(account);
        }
        return null
    }

}