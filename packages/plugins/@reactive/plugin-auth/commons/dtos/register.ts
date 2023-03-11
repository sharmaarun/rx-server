import { IsNotEmpty, MinLength } from "class-validator"

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
