import { createCoreRouter } from "@reactive/server";
import { resolve } from "path";

export default createCoreRouter("auth", ctx => ([
    {
        method: "post",
        path: "/login",
        handler: "login"
    },
    {
        method: "post",
        path: "/register",
        handler: "register"
    },
    {
        method: "post",
        path: "/request-password-reset",
        handler: "requestPasswordReset"
    },
    {
        method: "post",
        path: "/reset-password",
        handler: "resetPassword"
    },
    {
        method: "post",
        path: "/verify-account",
        handler: "verifyAccount"
    },
]))