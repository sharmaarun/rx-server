import { createControllers } from "@reactive/server";

export default createControllers("role", (ctx) => ({
    list(req) {
        return req.send("<html><body><b>list</b></body></html>")
    },
    ola(req) {
        return req.send(`<html><body><b>${req.params.id}</b></body></html>`)
    }
}))
