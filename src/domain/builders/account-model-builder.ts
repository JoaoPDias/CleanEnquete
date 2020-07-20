import {AccountModel} from "../models/account";

export class AccountModelBuilder {
    private readonly _accountModel : AccountModel;

    private constructor() {
        this._accountModel = {
            id: 'valid_id',
            name: 'Valid Name',
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }
    }

    withId(id : string) : AccountModelBuilder {
        this._accountModel.id = id
        return this
    }

    withName(name : string) : AccountModelBuilder {
        this._accountModel.name = name
        return this
    }

    withEmail(email : string) : AccountModelBuilder {
        this._accountModel.email = email
        return this
    }

    withPassword(password : string) : AccountModelBuilder {
        this._accountModel.password = password
        return this
    }

    build() : AccountModel {
        return this._accountModel
    }

    static new() {
        return new AccountModelBuilder()
    }
}