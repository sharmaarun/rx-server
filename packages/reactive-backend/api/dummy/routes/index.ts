import { createRouter } from "@reactive/server";

export default createRouter("dummy", (ctx) => ([
    {
        path: "/",
        method: "get",
        handler: "list",
    }
]))