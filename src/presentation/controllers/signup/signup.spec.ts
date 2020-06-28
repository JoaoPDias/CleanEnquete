import {SignUpController} from "./signup";
import {InvalidParamError, MissingParamError, ServerError} from "../../errors";
import {AccountModel, AddAccount, AddAccountModel, EmailValidator} from "./signup-protocols";


const makeEmailValidator = () : EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email : string) : boolean {
            return true;
        }
    }

    return new EmailValidatorStub();
}

const makeAddAccount = () : AddAccount => {
    class AddAccountStub implements AddAccount {
        add(account : AddAccountModel) : AccountModel {
            return {
                id: 'valid_id',
                name: 'valid_name',
                email: 'valid_email@mail.com',
                password: 'valid_password'
            };
        }
    }

    return new AddAccountStub();
}

interface SutTypes {
    sut : SignUpController
    emailValidatorStub : EmailValidator
    addAccountStub : AddAccount
}

const makeSut = () : SutTypes => {
    const emailValidatorStub = makeEmailValidator();
    const addAccountStub = makeAddAccount();
    const sut = new SignUpController(emailValidatorStub, addAccountStub);
    return {sut, emailValidatorStub, addAccountStub}
};
describe('SignUp Controller', () => {
    test('Should return 400 if no name is provided', () => {
        const {sut} = makeSut();
        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })
})

describe('SignUp Controller', () => {
    test('Should return 400 if no email is provided', () => {
        const {sut} = makeSut();
        const httpRequest = {
            body: {
                name: 'Any Name',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })
})

describe('SignUp Controller', () => {
    test('Should return 400 if no password is provided', () => {
        const {sut} = makeSut();
        const httpRequest = {
            body: {
                name: 'Any Name',
                email: 'any_email@mail.com',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })
})
describe('SignUp Controller', () => {
    test('Should return 400 if no passwordConfirmation is provided', () => {
        const {sut} = makeSut();
        const httpRequest = {
            body: {
                name: 'Any Name',
                email: 'any_email@mail.com',
                password: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
    });
})

describe('SignUp Controller', () => {
    test('Should return 400 if an invalid email is provided', () => {
        const {sut, emailValidatorStub} = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const httpRequest = {
            body: {
                name: 'Any Name',
                email: 'invalid_email@mail.com',
                password: 'any_passwords',
                passwordConfirmation: 'any_passwords'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    });
})
describe('SignUp Controller', () => {
    test('Should return 400 if passwordConfirmation fails', () => {
        const {sut} = makeSut();
        const httpRequest = {
            body: {
                name: 'Any Name',
                email: 'invalid_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_passwords'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
    });
})
describe('SignUp Controller', () => {
    test('Should call EmailValidator with correct email', () => {
        const {sut, emailValidatorStub} = makeSut();
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
        const httpRequest = {
            body: {
                name: 'Any Name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        sut.handle(httpRequest)
        expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
    })
})

describe('SignUp Controller', () => {
    test('Should return 500 if an EmailValidator throws', () => {
        const {sut, emailValidatorStub} = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
            throw new Error();
        });
        const httpRequest = {
            body: {
                name: 'Any Name',
                email: 'invalid_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    });
})
describe('SignUp Controller', () => {
    test('Should call AddAccount with correct values', () => {
        const {sut, addAccountStub} = makeSut();
        const addSpy = jest.spyOn(addAccountStub, 'add');
        const httpRequest = {
            body: {
                name: 'Any Name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        sut.handle(httpRequest)
        expect(addSpy).toHaveBeenCalledWith({
            name: 'Any Name',
            email: 'any_email@mail.com',
            password: 'any_password'
        });
    })
})
