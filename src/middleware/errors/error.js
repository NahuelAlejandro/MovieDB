
export class UserValidationError extends Error {
    constructor(message){
        super(message)
        this.name = 'UserValidationError'
        this.stack = ''
    }
}
export class MovieValidationError extends Error{
    constructor(message){
        super(message)
        this.name = 'MovieValidationError'
        this.stack = ""
    }
}

export class jsonwebtokenError extends Error{
    constructor(message){
        super(message)
        this.name = 'JsonWebTokenError'
        this.stack = ""
    }

}