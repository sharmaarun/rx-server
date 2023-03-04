import { ValidationError } from "class-validator";
import { BaseError, BaseErrorConstructorOpts } from "./base";

export class BaseValidationError extends BaseError {
    public errors!: ValidationError[]
    constructor(message: string, errors: ValidationError[], opts?: BaseErrorConstructorOpts) {
        const opts_: BaseErrorConstructorOpts = {
            ok: false,
            status: 400,
            statusText: "Client validation error",
            ...(opts || {})
        }
        super(message, opts_)
        this.errors = errors
        Object.setPrototypeOf(this, new.target.prototype);
    }
}