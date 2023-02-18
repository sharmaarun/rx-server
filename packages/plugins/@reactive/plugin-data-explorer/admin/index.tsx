import { registerCoreRoute } from "@reactive/client"
import { RXICO_FOLDER } from "@reactive/icons"
import { EditorPage, ListSchemas } from "./pages"

registerCoreRoute(ctx => ({
    title: "Data Explorer",
    path: "/explorer",
    element: () => <ListSchemas />
    ,
    icon: () => <RXICO_FOLDER />,
    children: [{
        title: "Data Explorer Entity Editor Layout",
        path: ":name",
        element: () => <EditorPage />,
        icon: <></>
    }]
}))

