import app from "../config/app";
import request from "supertest";
import {MongoHelper} from "../../infra/db/mongodb/helpers/mongo-helper";
beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
})

afterAll(async () => {
    await MongoHelper.disconnect()
})
beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
})
describe('SignUp Route', () => {
    test('Should receive JSON and statusCode 200', async () => {
        await request(app)
            .post('/api/signup')
            .send({
                name: 'João Paulo Dias',
                email: 'diasjp1997@gmail.com',
                password: '123',
                passwordConfirmation: '123'
            })
            .expect(200)
            .expect({ok: 'ok'})

    })
})