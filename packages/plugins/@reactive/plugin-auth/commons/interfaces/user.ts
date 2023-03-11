import { DefaultEntityAttributes } from "@reactive/commons"
import { Role } from "./role"

export type User = DefaultEntityAttributes & {
    name: string
    email: string
    password?: string
    gender: string
    isConfirmed: boolean
    isBlocked: boolean
    dob: Date | string
    roles: Role[]
    meta: any
}