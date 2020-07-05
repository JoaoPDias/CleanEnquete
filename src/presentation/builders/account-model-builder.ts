import {AccountModel} from "../../domain/models/account";

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

    id(id : string) : AccountModelBuilder {
        this._accountModel.id = id
        return this
    }

    name(name : string) : AccountModelBuilder {
        this._accountModel.name = name
        return this
    }

    email(email : string) : AccountModelBuilder {
        this._accountModel.email = email
        return this
    }

    password(password : string) : AccountModelBuilder {
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