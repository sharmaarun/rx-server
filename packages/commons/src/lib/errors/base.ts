export type BaseErrorConstructorOpts = {
    status?: number
    statusText?: string
    ok?: boolean
}

export class BaseError extends Error {
    public ok?: boolean
    public statusText?: string
    public status?: number
    constructor(message: string, opts?: BaseErrorConstructorOpts) {
        super(message)
        this.status = opts?.status
        this.statusText = opts?.statusText
        this.ok = opts?.ok
        Object.setPrototypeOf(this, new.target.prototype);
    }
}