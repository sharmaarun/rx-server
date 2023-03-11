import { BaseError, BaseValidationError } from "@reactive/commons";
import { createCoreControllers } from "@reactive/server";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { LoginValidationClass, RegisterValidationClass, UnauthorizedAccessError } from "../../../commons";
import { compareSync } from "bcrypt"
import { AuthManagerOptions } from "../../index";
import { sign } from "jsonwebtoken"

export const signJWT = (payload: any, secret: string) => {
    return sign(payload, secret)
}

export default ({ jsonSecret }: AuthManagerOptions) => createCoreControllers("auth", ctx => ({
    /**
     * Login user and return json web token
     * @param req 
     * @returns 
     */
    async login(req) {
        const errors = await validate(plainToInstance(LoginValidationClass, req.body || {}))
        if (errors?.length) throw new BaseValidationError("Login failed", errors)

        const { email, password }: LoginValidationClass = req.body || {}
        // fetch user
        let user: any = await ctx.query("superuser").findOne({ where: { email } })
        if (!user) {
            user = await ctx.query("user").findOne({ where: { email } })
            if (!user) throw new BaseError(`Invalid credentials provided`)

            if (!user.isConfirmed) throw new UnauthorizedAccessError(`Account is not verified. Please check your email id and click on the verification link sent at the time of registration`)
            if (user.isBlocked) throw new UnauthorizedAccessError(`Account is Blocked`)
        }

        if (!compareSync(password, user?.["password"])) throw new BaseError(`Invalid credentials provided`)

        // sign token
        const { name, id } = user || {}
        const token = signJWT({ name, email, id }, jsonSecret || "abrakadabra")

        return req.send({
            token,
            user
        })
    },

    /**
     * Register as a new public user and return json web token
     * @param req 
     * @returns 
     */
    async register(req) {
        const errors = await validate(plainToInstance(RegisterValidationClass, req.body || {}))
        if (errors?.length) throw new BaseValidationError("Please check your inputs", errors)

        const { name, email, password, repassword }: RegisterValidationClass = req.body || {}

        if (password !== repassword) throw new BaseValidationError("Invalid password", [
            {
                property: "repassword",
                constraints: {
                    "noMatch": "Passwords do not match"
                }
            }
        ])

        // fetch user
        const exists = await ctx.query("superuser").count()
        if (exists) throw new BaseError(`Super user already registered!`)

        const user: any = {
            email,
            password,
            age: 3,
            name
        }

        // create new user
        const created: any = await ctx.query("superuser").create(user)
        // sign token

        const { id } = created || {}
        const token = signJWT({ name, email, id }, jsonSecret || "abrakadabra")
        return req.send({
            token,
            user: created
        })
    }
}))