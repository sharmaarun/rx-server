import { createRouter } from "@reactive/server";

export default createRouter("data-types", ctx => ([{
    path: "/",
    method: "get",
    handler: "list"
}]))