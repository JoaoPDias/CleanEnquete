import {Hasher} from "../../../data/protocols/criptography/hasher";
import bcrypt from 'bcrypt'
import {HashComparer} from "../../../data/protocols/criptography/hash-comparer";

export class BCryptAdapter implements Hasher, HashComparer {

    constructor(private readonly _salt : number) {
    }

    async hash(value : string) : Promise<string> {
        try {
            return bcrypt.hash(value, this._salt)
        } catch (e) {

        }
    }

    async compare(value : string, hash : string) : Promise<boolean> {
        return bcrypt.compare(value, hash)
    }

}