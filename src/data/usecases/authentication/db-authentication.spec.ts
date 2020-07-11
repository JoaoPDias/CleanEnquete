import {AccountModel} from "../../../domain/models/account";
import {AccountModelBuilder} from "../../../domain/builders/account-model-builder";
import {LoadAccountByEmailRepository} from "../../protocols/db/load-account-by-email.repository";
import {DbAuthentication} from "./db.authentication";
import {AuthenticationModelBuilder} from "../../../presentation/builders/authentication-model-builder";

const makeLoadAccountByEmail = () => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async load(email : string) : Promise<AccountModel> {
            const account = AccountModelBuilder.new().build()
            return Promise.resolve(account)
        }
    }

    return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
    sut : DbAuthentication
    loadAccountByEmailRepositoryStub : LoadAccountByEmailRepository
}

const makeSut = () : SutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmail()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
    return {
        sut,
        loadAccountByEmailRepositoryStub
    }
}
const authenticationModel = AuthenticationModelBuilder.new().build()
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
});