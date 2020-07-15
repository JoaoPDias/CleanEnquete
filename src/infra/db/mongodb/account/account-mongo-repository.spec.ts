import {MongoHelper} from "../helpers/mongo-helper";
import {AccountMongoRepository} from "./account-mongo-repository";
import {Collection} from "mongodb";
import {AddAccountModelBuilder} from "../../../../data/usecases/add-account/builders/add-account-model-builder";

let accountCollection : Collection
let accountDefault = AddAccountModelBuilder.new().build()
describe('Account Mongo Repository', () => {

    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })
    beforeEach(async () => {
        accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })
    const makeSut = () : AccountMongoRepository => {
        return new AccountMongoRepository()
    }
    test('Should return an account on add success', async () => {
        const sut = makeSut()
        const account = await sut.add(accountDefault)
        expect(account).toBeTruthy()
        expect(account.id).toBeTruthy()
        expect(account.name).toBe(accountDefault.name)
        expect(account.email).toBe(accountDefault.email)
        expect(account.password).toBe(accountDefault.password)
    })
    test('Should return an account on loadByEmail success', async () => {
        const sut = makeSut()
        await accountCollection.insertOne(accountDefault)
        const account = await sut.loadByEmail(accountDefault.email)
        expect(account).toBeTruthy()
        expect(account.id).toBeTruthy()
        expect(account.name).toBe(accountDefault.name)
        expect(account.email).toBe(accountDefault.email)
        expect(account.password).toBe(accountDefault.password)
    })
    test('Should return null on loadByEmail fails', async () => {
        const sut = makeSut()
        const account = await sut.loadByEmail(accountDefault.email)
        expect(account).toBeFalsy()
    })
    test('Should update the account accessToken on updateAccessToken sucess', async () => {
        const sut = makeSut()
        const res = await accountCollection.insertOne(accountDefault)
        const fakeAccount = res.ops[0];
        expect(fakeAccount.accessToken).toBeFalsy()
        await sut.updateAccessToken(fakeAccount._id, 'any_token')
        const account = await accountCollection.findOne({_id: fakeAccount._id})
        expect(account).toBeTruthy()
        expect(account.accessToken).toBe('any_token')
    });
})