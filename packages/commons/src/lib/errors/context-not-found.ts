export class ContextNotFoundError extends Error {
    constructor() {
        super("Context not defined")
        this.name = "Context not defined"
    }
}