import {AddAccountRequest} from "./builders-models/add-account/add-account-request";

export class AddAccountRequestBuilder {
    private readonly _addAccountRequest : AddAccountRequest;

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

    withName(name : string) : AddAccountRequestBuilder {
        this._addAccountRequest.name = name
        return this
    }

    withEmail(email : string) : AddAccountRequestBuilder {
        this._addAccountRequest.email = email
        return this
    }

    withPassword(password : string) : AddAccountRequestBuilder {
        this._addAccountRequest.password = password
        return this
    }

    withPasswordConfirmation(passwordConfirmation : string) : AddAccountRequestBuilder {
        this._addAccountRequest.passwordConfirmation = passwordConfirmation
        return this
    }

    build() : AddAccountRequest {
        return this._addAccountRequest
    }

}