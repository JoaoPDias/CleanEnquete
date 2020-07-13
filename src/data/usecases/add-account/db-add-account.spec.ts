import {DbAddAccount} from "./db-add-account";
import {AccountModel, AddAccountModel, AddAccountRepository, Hasher} from "./db-account-protocols";
import {AccountModelBuilder} from "../../../domain/builders/account-model-builder";

const fakeAccount = AccountModelBuilder.new().password('hashed_password').build()
const makeAddAccountRepository = () : AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add(accountData : AddAccountModel) : Promise<AccountModel> {
            return Promise.resolve(fakeAccount)
        }
    }

    return new AddAccountRepositoryStub()
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
}

const makeSut = () : SutTypes => {
    const hasherStub = makeHasher()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)
    return {
        sut, hasherStub, addAccountRepositoryStub
    }
}
describe('DbAddAccount Usecase', () => {
    test('Should call Hasher with correct password', () => {
        const {sut, hasherStub} = makeSut()
        const encryptSpy = jest.spyOn(hasherStub, 'hash')
        const accountData = AccountModelBuilder.new().build()
        sut.add(accountData)
        expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
    })
    test('Should throw if Hasher throws', async () => {
        const {sut, hasherStub} = makeSut()
        jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
        const accountData = AccountModelBuilder.new().build()
        const promise = sut.add(accountData)
        await expect(promise).rejects.toThrow()
    })
    test('Should call AddAccountRepository with correct values', async () => {
        const {sut, addAccountRepositoryStub} = makeSut()
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
        const accountData = AccountModelBuilder.new().build()
        await sut.add(accountData)
        expect(addSpy).toHaveBeenCalledWith(fakeAccount)
    })
    test('Should throw if AddAccountRepository throws', async () => {
        const {sut, addAccountRepositoryStub} = makeSut()
        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
        const accountData = AccountModelBuilder.new().build()
        const promise = sut.add(accountData)
        await expect(promise).rejects.toThrow()
    })
    test('Should return an account on success', async () => {
        const {sut} = makeSut()
        const accountData = AccountModelBuilder.new().build()
        const account = await sut.add(accountData)
        expect(account).toEqual(AccountModelBuilder.new().password('hashed_password').build())
    })

})