import {AuthenticationModel} from "../../domain/usecases/authentication";

export class AuthenticationModelBuilder {
    private authenticationModel : AuthenticationModel;

    constructor() {
        this.authenticationModel = {
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }
    }

    static new() {
        return new AuthenticationModelBuilder()
    }

    email(email : string) : AuthenticationModelBuilder {
        this.authenticationModel.email = email
        return this
    }

    password(password : string) : AuthenticationModelBuilder {
        this.authenticationModel.password = password
        return this
    }

    build() : AuthenticationModel {
        return this.authenticationModel
    }

}