import { registerCoreRoute } from "@reactive/client"
import { RXICO_DASHBOARD } from "@reactive/icons"
import React from "react"
import ListEndpoints from "./pages"

registerCoreRoute(ctx => ({
    title: "Data Types",
    path: "/data-types",
    element: () => <ListEndpoints />
    ,
    icon: () => <RXICO_DASHBOARD />,
    children: [{
        title: "ola",
        path: "test",
        element: () => <>inner</>,
        icon: <></>
    }]
}))

