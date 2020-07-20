import {AuthenticationModel} from "../usecases/authentication";

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

    withEmail(email : string) : AuthenticationModelBuilder {
        this.authenticationModel.email = email
        return this
    }

    withPassword(password : string) : AuthenticationModelBuilder {
        this.authenticationModel.password = password
        return this
    }

    build() : AuthenticationModel {
        return this.authenticationModel
    }

}