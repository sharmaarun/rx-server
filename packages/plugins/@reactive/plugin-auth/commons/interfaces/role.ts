import { APIRoute } from "@reactive/commons";
import { User } from "./user";

export type ApiPermission = Partial<APIRoute> & {
    name: string
}

export type Role = {
    name: string
    apiPermissions: ApiPermission[]
    users: User[]
    isCore?: boolean
}