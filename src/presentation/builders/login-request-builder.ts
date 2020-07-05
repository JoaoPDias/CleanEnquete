import {LoginRequest} from "./buildersModels/Login/login-request";

export class LoginRequestBuilder {
    private _loginRequest : LoginRequest;

    constructor() {
        this._loginRequest = {
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }
    }

    static new() {
        return new LoginRequestBuilder()
    }

    email(email : string) : LoginRequestBuilder {
        this._loginRequest.email = email
        return this
    }

    password(password : string) : LoginRequestBuilder {
        this._loginRequest.password = password
        return this
    }

    build() : LoginRequest {
        return this._loginRequest
    }

}