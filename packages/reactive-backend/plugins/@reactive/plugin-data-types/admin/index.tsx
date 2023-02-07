import { registerCoreRoute } from "@reactive/client"
import { RXICO_DASHBOARD } from "@reactive/icons"
import { EditorPage, ListEndpoints } from "./pages"

registerCoreRoute(ctx => ({
    title: "Data Types",
    path: "/data-types",
    element: () => <ListEndpoints />
    ,
    icon: () => <RXICO_DASHBOARD />,
    children: [{
        title: "Data Type Display Outlet",
        path: ":name",
        element: () => <EditorPage />,
        icon: <></>
    }]
}))

