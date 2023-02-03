import { createRouter } from "@reactive/server";

export default createRouter("class-builder", ctx => ([{
    path: "/",
    method: "get",
    handler: "test",
}]))