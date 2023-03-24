import { createRouter } from "@reactive/server";

export const createFileRoutes = createRouter("file", crx => ([
    {
        path: "/upload",
        method: "post",
        handler: "upload",
    },
    {
        path: "/:type/:name",
        method: "get",
        handler: "get",
    }
]))