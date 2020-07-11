import {AccountModel} from "../../../domain/models/account";
import {AccountModelBuilder} from "../../../domain/builders/account-model-builder";
import {LoadAccountByEmailRepository} from "../../protocols/load-account-by-email.repository";
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
});