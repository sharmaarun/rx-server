import { BaseError } from "@reactive/commons";

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
export class AccessDeniedError extends BaseError {
    constructor(
        message: string
    ) {
        super(message, {
            ok: false,
            status: 401,
            statusText: "Access denied for requested api"
        })
    }
}
