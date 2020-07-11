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
const authenticationModel = AuthenticationModelBuilder.new().build()
describe('DbAuthentication UseCase', () => {
    test('Should call LoadAccountByEmailRepository with correct email', async () => {
        const loadAccountByEmailRepositoryStub = makeLoadAccountByEmail()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
        const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
        await sut.auth(authenticationModel)
        expect(loadSpy).toHaveBeenCalledWith(authenticationModel.email)
    });
});