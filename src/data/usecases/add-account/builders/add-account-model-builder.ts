import {AddAccountModel} from "../../../../domain/usecases/add-account";

export class AddAccountModelBuilder {
    private readonly _addAccountModel : AddAccountModel;

    constructor() {
        this._addAccountModel = {
            name: 'Valid Name',
            email: 'validEmail@mail.com',
            password: 'valid_password'
        }
    }

    name(name : string) : AddAccountModelBuilder {
        this._addAccountModel.name = name
        return this
    }

    email(email : string) : AddAccountModelBuilder {
        this._addAccountModel.email = email
        return this
    }

    password(password : string) : AddAccountModelBuilder {
        this._addAccountModel.password
        return this
    }

    build() : AddAccountModel {
        return this._addAccountModel
    }
}