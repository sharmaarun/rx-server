import { IsNotEmpty, MinLength } from "class-validator"

export class LoginValidationClass {
    @IsNotEmpty({ message: `Should not be empty` })
    email!: string
    @IsNotEmpty({ message: `Should not be empty` })
    password!: string
}
