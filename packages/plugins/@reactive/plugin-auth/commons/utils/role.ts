import { ApiPermission, Role } from "../interfaces"

export const DefaultPublicRole: Role = {
    name: "public",
    apiPermissions: [],
    users: [],
    isCore: true
}
export const DefaultAuthenticatedRole: Role = {
    name: "authenticated",
    apiPermissions: [],
    users: [],
    isCore: true
}

export const apiPermissionsMatch = (permission: ApiPermission, v: ApiPermission) => {
    return (
        v.handler === permission.handler &&
        v.method === permission.method &&
        v.name === permission.name &&
        v.path === permission.path &&
        v.staticPath === permission.staticPath
    )
}