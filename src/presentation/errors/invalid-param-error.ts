export class InvalidParamError extends Error {
    constructor(paramName : string) {
        super(`Invalid param: ${paramName}`)
        this.name = 'InvalidParamError'
    }

}

export class EmailInUseError extends Error {
    constructor(email : string) {
        super(`The email "${email}" is already in use: ${email}`)
        this.name = 'EmailInUseError'
    }

}