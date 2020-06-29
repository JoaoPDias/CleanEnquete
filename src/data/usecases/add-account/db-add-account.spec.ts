import {DbAddAccount} from "./db-add-account";
import {Encrypter} from "./db-account-protocols";

interface SutTypes {
    sut : DbAddAccount
    encrypterStub : Encrypter
}

const makeEncrypter = () : Encrypter => {
    class EncrypterStub {
        async encrypt(value : string) : Promise<string> {
            return Promise.resolve('hashed_password')
        }
    }

    return new EncrypterStub()
}
const makeSut = () : SutTypes => {
    const encrypterStub = makeEncrypter()
    const sut = new DbAddAccount(encrypterStub)
    return {
        sut, encrypterStub
    }
}
describe('DbAddAccount Usecase', () => {
    test('Should call Encrypter with correct password', () => {
        const {sut, encrypterStub} = makeSut()
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
        const accountData = {
            name: 'Valid Name',
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }
        sut.add(accountData)
        expect(encryptSpy).toHaveBeenCalledWith('valid_password')
    })
    test('Should throw if Encrypter throws', async () => {
        const {sut, encrypterStub} = makeSut()
        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))
        const accountData = {
            name: 'Valid Name',
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }
        const promise = sut.add(accountData)
        await expect(promise).rejects.toThrow()
    })
})