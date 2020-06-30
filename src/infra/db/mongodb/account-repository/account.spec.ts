import {MongoHelper} from "../helpers/mongo-helper";
import {AccountMongoRepository} from "./accountMongoRepository";

describe('Account Mongo Repository', () => {

    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    test('Should return an account on succss', async () => {
        const sut = new AccountMongoRepository()
        const account = await sut.add({
            name: 'Any Name',
            email: 'any_email@mail.com',
            password: 'any_password'
        })
        expect(account).toBeTruthy()
        expect(account.id).toBeTruthy()
        expect(account.name).toBe('Any Name')
        expect(account.email).toBe('any_email@mail.com')
        expect(account.password).toBe('any_password')
    })
})