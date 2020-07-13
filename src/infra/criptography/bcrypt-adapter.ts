import {Hasher} from "../../data/protocols/criptography/hasher";
import bcrypt from 'bcrypt'
import {HashComparer} from "../../data/protocols/criptography/hash-comparer";

export class BCryptAdapter implements Hasher, HashComparer {
    private readonly salt : number

    constructor(salt : number) {
        this.salt = salt
    }

    async hash(value : string) : Promise<string> {
        try {
            return await bcrypt.hash(value, this.salt)
        } catch (e) {

        }
    }

    async compare(value : string, hash : string) : Promise<boolean> {
        return await bcrypt.compare(value, hash)
    }

}