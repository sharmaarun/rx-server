import { createRouter } from "@reactive/server";
import { resolve } from "path";

export default createRouter("admin", ctx => ([
    {
        path: "/",
        method: "get",
        handler: "test",
        staticPath: resolve(process.cwd(), ".cache/admin")
    },
    {
        path: "/",
        method: "get",
        handler: "test",
        staticPath: resolve(process.cwd(), ".cache/admin")
    },
    {
        path: "/admin/",
        method: "get",
        handler: "test",
        staticPath: resolve(process.cwd(), ".cache/admin/index.html")
    },
    {
        path: "/admin",
        method: "get",
        handler: "test",
        staticPath: resolve(process.cwd(), ".cache/admin/index.html")
    },
    {
        path: "/admin/*",
        method: "get",
        handler: "test",
        staticPath: resolve(process.cwd(), ".cache/admin/index.html")
    },

    // server
    {
        path: "/__server",
        method: "get",
        handler: "config",
    }

]))