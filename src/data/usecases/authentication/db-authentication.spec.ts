import {DbAuthentication} from "./db.authentication";
import {AuthenticationModelBuilder} from "../../../presentation/builders/authentication-model-builder";
import {LoadAccountByEmailRepository} from "../../protocols/db/load-account-by-email-repository";
import {AccountModelBuilder} from "../../../domain/builders/account-model-builder";
import {AccountModel} from "../../../domain/models/account";
import {HashComparer} from "../../protocols/criptography/hash-comparer";

const authenticationModel = AuthenticationModelBuilder.new().build()
const accountModel = AccountModelBuilder.new().password('hashed_password').build()
const makeLoadAccountByEmail = () => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async load(email : string) : Promise<AccountModel> {
            return Promise.resolve(accountModel)
        }
    }

    return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparer = () => {
    class HashComparerStub implements HashComparer {
        async compare(value : string, hash : string) : Promise<boolean> {
            return Promise.resolve(true)
        }
    }

    return new HashComparerStub()
}
interface SutTypes {
    sut : DbAuthentication
    loadAccountByEmailRepositoryStub : LoadAccountByEmailRepository
    hashComparerStub : HashComparer
}


const makeSut = () : SutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmail()
    const hashComparerStub = makeHashComparer()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub)
    return {
        sut,
        loadAccountByEmailRepositoryStub,
        hashComparerStub
    }
}
describe('DbAuthentication UseCase', () => {
    test('Should call LoadAccountByEmailRepository with correct email', async () => {
        const {sut, loadAccountByEmailRepositoryStub} = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
        await sut.auth(authenticationModel)
        expect(loadSpy).toHaveBeenCalledWith(authenticationModel.email)
    });
    test('Should throw an error if LoadAccountByEmailRepository throws', async () => {
        const {sut, loadAccountByEmailRepositoryStub} = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(Promise.reject(new Error()))
        const promise = sut.auth(authenticationModel)
        await expect(promise).rejects.toThrow()
    });
    test('Should return null if LoadAccountByEmailRepository returns null', async () => {
        const {sut, loadAccountByEmailRepositoryStub} = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null)
        const accessToken = await sut.auth(authenticationModel)
        expect(accessToken).toBeNull()
    });
    test('Should call HashComparer with correct password', async () => {
        const {sut, hashComparerStub} = makeSut()
        const compareSpy = jest.spyOn(hashComparerStub, 'compare')
        await sut.auth(authenticationModel)
        expect(compareSpy).toHaveBeenCalledWith(authenticationModel.password, accountModel.password)
    });
    test('Should throw an error if HashComparer throws', async () => {
        const {sut, hashComparerStub} = makeSut()
        jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.reject(new Error()))
        const promise = sut.auth(authenticationModel)
        await expect(promise).rejects.toThrow()
    });
});