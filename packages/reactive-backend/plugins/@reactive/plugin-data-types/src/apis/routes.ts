import { createRouter } from "@reactive/server";

export default createRouter("data-types", ctx => ([
    {
        path: "/",
        method: "post",
        handler: "create"
    },
    {
        path: "/",
        method: "get",
        handler: "list"
    },
    {
        path: "/:name",
        method: "put",
        handler: "update"
    },
    {
        path: "/:name",
        method: "delete",
        handler: "delete"
    },
]))