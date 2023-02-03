import { createControllers } from "@reactive/server";

export default createControllers("dummy", (ctx) => ({
    list(req, res) {
        return res.status(200)
            .header("content-type", "text/html")
            .send("<html><body><b>list</b></body></html>")
    },
    ola(req, res) {
        return res.status(200)
            .header("content-type", "text/html")
            .send(`<html><body><b>${req.params.id}</b></body></html>`)
    }
}))
