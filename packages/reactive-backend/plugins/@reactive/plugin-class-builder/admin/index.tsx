import { Box } from "@chakra-ui/react"
import { registerRoute } from "@reactive/client"
import React from "react"
import { Tmp } from "./tmp"

registerRoute(ctx => ({
    title: "Endpoints Builder",
    path: "/endpoints",
    element: () =>
        <Box>asd asdas<Tmp/></Box>
    ,
    icon: <></>
}))

