import { BaseError, BaseErrorConstructorOpts } from "@reactive/commons"
import { IsNotEmpty, MinLength } from "class-validator"

export class LoginValidationClass {
    @IsNotEmpty({ message: `Should not be empty` })
    email!: string
    @IsNotEmpty({ message: `Should not be empty` })
    password!: string
}

export class RegisterValidationClass {
    @MinLength(3, { message: `Should be at least 3 characters long` })
    @IsNotEmpty({ message: `Should not be empty` })
    name!: string
    @IsNotEmpty({ message: `Should not be empty` })
    email!: string
    @IsNotEmpty({ message: `Should not be empty` })
    password!: string
    @IsNotEmpty({ message: `Should not be empty` })
    repassword!: string
}


export class UnauthorizedAccessError extends BaseError {
    constructor(
        message: string
    ) {
        super(message, {
            ok: false,
            status: 401,
            statusText: "Unauthorized Access"
        })
    }
}