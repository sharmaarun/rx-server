import React from "react"
import { registerRoute } from "@reactive/client"

registerRoute(ctx => ({
    title: "Endpoints Builder",
    path: "/endpoints",
    element: () => <div>This ola aad</div>,
    icon: <></>
}))