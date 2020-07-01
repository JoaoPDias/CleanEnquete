import app from "../config/app";
import request from "supertest";

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