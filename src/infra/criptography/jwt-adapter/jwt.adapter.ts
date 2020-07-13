import {Encrypter} from "../../../data/protocols/criptography/encrypter";
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter {
    private readonly _secret : string;

    constructor(secret : string) {
        this._secret = secret;
    }

    async encrypt(value : string) : Promise<string> {
        const accessToken = await jwt.sign({id: value}, this._secret)
        return Promise.resolve(accessToken);
    }

}