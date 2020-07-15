import {DbAuthentication} from "./db.authentication";
import {
    AccountModel,
    AccountModelBuilder,
    AuthenticationModelBuilder,
    Encrypter,
    HashComparer,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository
} from "./db-authentication-protocols";


const authenticationModel = AuthenticationModelBuilder.new().build()
const accountModel = AccountModelBuilder.new().password('hashed_password').build()
const makeLoadAccountByEmail = () => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async loadByEmail(email : string) : Promise<AccountModel> {
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
    class TokenGeneratorStub implements Encrypter {
        async encrypt(id : string) : Promise<string> {
            return Promise.resolve('valid_token')
        }
    }

    return new TokenGeneratorStub()
}
const makeUpdateAccessTokenRepository = () => {
    class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
        async updateAccessToken(id : string, token : string) : Promise<void> {
            return Promise.resolve()
        }
    }

    return new UpdateAccessTokenRepositoryStub()
}

interface SutTypes {
    sut : DbAuthentication
    loadAccountByEmailRepositoryStub : LoadAccountByEmailRepository
    hashComparerStub : HashComparer
    tokenGeneratorStub : Encrypter
    updateAccessTokenRepositoryStub : UpdateAccessTokenRepository
}


const makeSut = () : SutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmail()
    const hashComparerStub = makeHashComparer()
    const tokenGeneratorStub = makeTokenGenerator()
    const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, tokenGeneratorStub, updateAccessTokenRepositoryStub)
    return {
        sut,
        loadAccountByEmailRepositoryStub,
        hashComparerStub,
        tokenGeneratorStub,
        updateAccessTokenRepositoryStub
    }
}
describe('DbAuthentication UseCase', () => {
    test('Should call LoadAccountByEmailRepository with correct email', async () => {
        const {sut, loadAccountByEmailRepositoryStub} = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
        await sut.auth(authenticationModel)
        expect(loadSpy).toHaveBeenCalledWith(authenticationModel.email)
    });
    test('Should throw an error if LoadAccountByEmailRepository throws', async () => {
        const {sut, loadAccountByEmailRepositoryStub} = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.reject(new Error()))
        const promise = sut.auth(authenticationModel)
        await expect(promise).rejects.toThrow()
    });
    test('Should return null if LoadAccountByEmailRepository returns null', async () => {
        const {sut, loadAccountByEmailRepositoryStub} = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null)
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
    test('Should call Encrypter with correct id', async () => {
        const {sut, tokenGeneratorStub} = makeSut()
        const generateSpy = jest.spyOn(tokenGeneratorStub, 'encrypt')
        await sut.auth(authenticationModel)
        expect(generateSpy).toHaveBeenCalledWith(accountModel.id)
    });
    test('Should throw an error if Encrypter throws', async () => {
        const {sut, tokenGeneratorStub} = makeSut()
        jest.spyOn(tokenGeneratorStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))
        const promise = sut.auth(authenticationModel)
        await expect(promise).rejects.toThrow()
    });
    test('Should return validToken if Encrypter returns a valid token', async () => {
        const {sut, tokenGeneratorStub} = makeSut()
        jest.spyOn(tokenGeneratorStub, 'encrypt')
        const accessToken = await sut.auth(authenticationModel)
        expect(accessToken).toBe('valid_token')
    });
    test('Should call UpdateAccessTokenRepository with correct values', async () => {
        const {sut, updateAccessTokenRepositoryStub} = makeSut()
        const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
        const validToken = await sut.auth(authenticationModel)
        expect(updateSpy).toHaveBeenCalledWith(accountModel.id, validToken)
    });
    test('Should throw an error if UpdateAccessTokenRepository throws', async () => {
        const {sut, updateAccessTokenRepositoryStub} = makeSut()
        jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockReturnValueOnce(Promise.reject(new Error()))
        const promise = sut.auth(authenticationModel)
        await expect(promise).rejects.toThrow()
    });
});