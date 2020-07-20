import {AddAccountModel} from "../../../../domain/usecases/add-account";

export class AddAccountModelBuilder {
    private readonly _addAccountModel : AddAccountModel;

    constructor() {
        this._addAccountModel = {
            name: 'Valid Name',
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }
    }

    static new() {
        return new AddAccountModelBuilder()
    }

    withName(name : string) : AddAccountModelBuilder {
        this._addAccountModel.name = name
        return this
    }

    withEmail(email : string) : AddAccountModelBuilder {
        this._addAccountModel.email = email
        return this
    }

    withPassword(password : string) : AddAccountModelBuilder {
        this._addAccountModel.password = password
        return this
    }

    build() : AddAccountModel {
        return this._addAccountModel
    }
}