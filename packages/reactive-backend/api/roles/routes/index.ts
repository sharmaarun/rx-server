import { createRouter } from "@reactive/server";

export default createRouter("role", (ctx) => ([
    {
        path: "/",
        method: "get",
        handler: "list",
    }
]))