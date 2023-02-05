import { registerRoute } from "@reactive/client"
import { Box } from "@chakra-ui/react"


registerRoute(ctx => ({
    title: "Endpoints Builder",
    path: "/endpoints",
    element: () => <div><Box>asd</Box>This ola aad  </div>,
    icon: <></>
}))