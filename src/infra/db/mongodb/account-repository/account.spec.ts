import {MongoHelper} from "../helpers/mongo-helper";
import {AccountMongoRepository} from "./account";
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
    test('Should return nulll on loadByEmail fails', async () => {
        const sut = makeSut()
        const account = await sut.loadByEmail(accountDefault.email)
        expect(account).toBeFalsy()
    })
})