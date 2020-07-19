import {DbAddAccount} from "./db-add-account";
import {AccountModel, AddAccountModel, AddAccountRepository, Hasher} from "./db-account-protocols";
import {AccountModelBuilder} from "../../../domain/builders/account-model-builder";
import {LoadAccountByEmailRepository} from "../../protocols/db/load-account-by-email-repository";
import {AddAccountModelBuilder} from "./builders/add-account-model-builder";

const fakeAccount = AccountModelBuilder.new().password('hashed_password').build()
const makeAddAccountRepository = () : AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add(accountData : AddAccountModel) : Promise<AccountModel> {
            return Promise.resolve(fakeAccount)
        }
    }

    return new AddAccountRepositoryStub()
}
const makeLoadAccountByEmail = () => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async loadByEmail(email : string) : Promise<AccountModel> {
            return Promise.resolve(null)
        }
    }

    return new LoadAccountByEmailRepositoryStub()
}
const makeHasher = () : Hasher => {
    class HasherStub implements Hasher {
        async hash(value : string) : Promise<string> {
            return Promise.resolve('hashed_password')
        }
    }

    return new HasherStub()
}

interface SutTypes {
    sut : DbAddAccount
    hasherStub : Hasher
    addAccountRepositoryStub : AddAccountRepository
    loadAccountByEmailRepositoryStub : LoadAccountByEmailRepository
}

const makeSut = () : SutTypes => {
    const hasherStub = makeHasher()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmail()
    const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
    return {
        sut, hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub
    }
}
describe('DbAddAccount Usecase', () => {
    const addAccountModel = AddAccountModelBuilder.new().build();
    test('Should call Hasher with correct password', async () => {
        const {sut, hasherStub} = makeSut()
        const expectPassword = addAccountModel.password
        const encryptSpy = jest.spyOn(hasherStub, 'hash')
        await sut.add(addAccountModel)
        expect(encryptSpy).toHaveBeenCalledWith(expectPassword)
    })
    test('Should throw if Hasher throws', async () => {
        const {sut, hasherStub} = makeSut()
        jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
        const promise = sut.add(addAccountModel)
        await expect(promise).rejects.toThrow()
    })
    test('Should call AddAccountRepository with correct values', async () => {
        const {sut, addAccountRepositoryStub} = makeSut()
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
        await sut.add(addAccountModel)
        expect(addSpy).toHaveBeenCalledWith(addAccountModel)
    })
    test('Should throw if AddAccountRepository throws', async () => {
        const {sut, addAccountRepositoryStub} = makeSut()
        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
        const promise = sut.add(addAccountModel)
        await expect(promise).rejects.toThrow()
    })
    test('Should return an account on success', async () => {
        const {sut} = makeSut()
        const account = await sut.add(addAccountModel)
        expect(account).toEqual(fakeAccount)
    })
    test('Should return null if loadAccountByEmailRepository not returns null', async () => {
        const {sut, loadAccountByEmailRepositoryStub} = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(fakeAccount))
        const account = await sut.add(addAccountModel)
        expect(account).toBe(null)
    })

    test('Should call loadAccountByEmailRepository with correct values', async () => {
        const {sut, loadAccountByEmailRepositoryStub} = makeSut()
        const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
        await sut.add(addAccountModel)
        expect(loadByEmailSpy).toHaveBeenCalledWith(fakeAccount.email)
    })

})