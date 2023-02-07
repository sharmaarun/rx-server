import { createRouter } from "@reactive/server";

export default createRouter("data-types", ctx => ([
    {
        path: "create/:name",
        method: "get",
        handler: "create"
    },
    {
        path: "/",
        method: "get",
        handler: "list"
    },
]))