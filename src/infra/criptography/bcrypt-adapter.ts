import {Encrypter} from "../../data/protocols/criptography/encrypter";
import bcrypt from 'bcrypt'

export class BCryptAdapter implements Encrypter {
    private readonly salt : number

    constructor(salt : number) {
        this.salt = salt
    }

    async encrypt(value : string) : Promise<string> {
        try {
            return await bcrypt.hash(value, this.salt)
        } catch (e) {

        }
    }

}