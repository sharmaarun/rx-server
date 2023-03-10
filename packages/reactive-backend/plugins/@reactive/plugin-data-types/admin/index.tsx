import { registerRoute } from "@reactive/client"
import { RXICO_DASHBOARD } from "@reactive/icons"
import { EditorPage, ListSchemas } from "./pages"

registerRoute(ctx => ({
    title: "Data Types",
    path: "/data-types",
    element: () => <ListSchemas />
    ,
    icon: () => <RXICO_DASHBOARD />,
    children: [{
        title: "Data Type Display Outlet",
        path: ":name",
        element: () => <EditorPage />,
        icon: <></>
    }]
}))

