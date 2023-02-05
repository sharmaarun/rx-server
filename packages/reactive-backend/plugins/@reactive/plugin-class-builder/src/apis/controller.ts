import { createControllers } from "@reactive/server";

export default createControllers("class-builder", ctx => ({
    test(req, res) {
        const str = JSON.stringify(ctx.endpoints.endpoints, null, 2)
        return res.header("content-type", "text/html").status(200).send(
            `<pre>${str}</pre>`
        )
    }
}))