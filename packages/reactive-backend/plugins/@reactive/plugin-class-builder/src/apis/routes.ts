import { createRouter } from "@reactive/server";

export default createRouter("class-builder", ctx => ([{
    path: "/asd",
    method: "get",
    handler: "test"
}]))