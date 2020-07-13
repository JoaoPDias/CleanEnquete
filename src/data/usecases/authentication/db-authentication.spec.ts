import {DbAuthentication} from "./db.authentication";
import {AuthenticationModelBuilder} from "../../../presentation/builders/authentication-model-builder";
import {LoadAccountByEmailRepository} from "../../protocols/db/load-account-by-email-repository";
import {AccountModelBuilder} from "../../../domain/builders/account-model-builder";
import {AccountModel} from "../../../domain/models/account";
import {HashComparer} from "../../protocols/criptography/hash-comparer";
import {TokenGenerator} from "../../protocols/criptography/token-generator";

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

const makeTokenGenerator = () => {
    class TokenGeneratorStub implements TokenGenerator {
        async generate(id : string) : Promise<string> {
            return Promise.resolve('valid_token')
        }
    }

    return new TokenGeneratorStub()
}

interface SutTypes {
    sut : DbAuthentication
    loadAccountByEmailRepositoryStub : LoadAccountByEmailRepository
    hashComparerStub : HashComparer
    tokenGeneratorStub : TokenGenerator
}


const makeSut = () : SutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmail()
    const hashComparerStub = makeHashComparer()
    const tokenGeneratorStub = makeTokenGenerator()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, tokenGeneratorStub)
    return {
        sut,
        loadAccountByEmailRepositoryStub,
        hashComparerStub,
        tokenGeneratorStub
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
    test('Should return null if HashComparer returns false', async () => {
        const {sut, hashComparerStub} = makeSut()
        jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
        const accessToken = await sut.auth(authenticationModel)
        expect(accessToken).toBeNull()
    });
    test('Should call TokenGenerator with correct id', async () => {
        const {sut, tokenGeneratorStub} = makeSut()
        const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
        await sut.auth(authenticationModel)
        expect(generateSpy).toHaveBeenCalledWith(accountModel.id)
    });
    test('Should throw an error if TokenGenerator throws', async () => {
        const {sut, tokenGeneratorStub} = makeSut()
        jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(Promise.reject(new Error()))
        const promise = sut.auth(authenticationModel)
        await expect(promise).rejects.toThrow()
    });
});