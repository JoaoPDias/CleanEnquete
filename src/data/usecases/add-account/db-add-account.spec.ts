import {DbAddAccount} from "./db-add-account";
import {AccountModel, AddAccountModel, AddAccountRepository, Encrypter} from "./db-account-protocols";


const makeAddAccountRepository = () : AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add(accountData : AddAccountModel) : Promise<AccountModel> {
            const fakeAccount = {
                id: 'valid_id',
                name: 'Valid Name',
                email: 'valid_email@mail.com',
                password: 'hashed_password'
            }
            return Promise.resolve(fakeAccount)
        }
    }

    return new AddAccountRepositoryStub()
}
const makeEncrypter = () : Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt(value : string) : Promise<string> {
            return Promise.resolve('hashed_password')
        }
    }

    return new EncrypterStub()
}

interface SutTypes {
    sut : DbAddAccount
    encrypterStub : Encrypter
    addAccountRepositoryStub : AddAccountRepository
}

const makeSut = () : SutTypes => {
    const encrypterStub = makeEncrypter()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
    return {
        sut, encrypterStub, addAccountRepositoryStub
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
    test('Should call AddAccountRepository with correct values', async () => {
        const {sut, addAccountRepositoryStub} = makeSut()
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
        const accountData = {
            name: 'Valid Name',
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }
        await sut.add(accountData)
        expect(addSpy).toHaveBeenCalledWith({
            name: 'Valid Name',
            email: 'valid_email@mail.com',
            password: 'hashed_password'
        })
    })
    test('Should throw if AddAccountRepository throws', async () => {
        const {sut, addAccountRepositoryStub} = makeSut()
        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
        const accountData = {
            name: 'Valid Name',
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }
        const promise = sut.add(accountData)
        await expect(promise).rejects.toThrow()
    })

})