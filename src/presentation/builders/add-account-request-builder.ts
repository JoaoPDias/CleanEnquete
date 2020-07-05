import {AddAccountRequest} from "./buildersModels/add-account-request";

export class AddAccountRequestBuilder {
    private readonly _addAccountRequest;

    private constructor() {
        this._addAccountRequest = {
            name: "Valid Name",
            email: "valid_email@mail.com",
            password: "valid_password",
            passwordConfirmation: "valid_password"
        }
    }

    static new() : AddAccountRequestBuilder {
        return new AddAccountRequestBuilder()
    }

    name(name : string) : AddAccountRequestBuilder {
        this._addAccountRequest.name = name
        return this
    }

    email(email : string) : AddAccountRequestBuilder {
        this._addAccountRequest.email = email
        return this
    }

    password(password : string) : AddAccountRequestBuilder {
        this._addAccountRequest.password = password
        return this
    }

    passwordConfirmation(passwordConfirmation : string) : AddAccountRequestBuilder {
        this._addAccountRequest.passwordConfirmation = passwordConfirmation
        return this
    }

    build() : AddAccountRequest {
        return this._addAccountRequest
    }

}