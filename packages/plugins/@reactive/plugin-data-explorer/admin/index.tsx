import { registerCoreRoute } from "@reactive/client"
import { RXICO_FOLDER } from "@reactive/icons"
import { EditorPage, ListSchemas } from "./pages"
import CreatePage from "./pages/explorer/create"
import { ListViewPage } from "./pages/explorer/viewer"

registerCoreRoute(ctx => ({
    title: "Data Explorer",
    path: "/explorer",
    element: () => <ListSchemas />
    ,
    icon: () => <RXICO_FOLDER />,
    children: [
        {
            title: "Data Explorer New Entity Layout",
            path: ":name/new",
            element: () => <CreatePage />,
            icon: <></>
        },
        {
            title: "Data Explorer Entity Editor Layout",
            path: ":name/:id",
            element: () => <EditorPage />,
            icon: <></>
        },
        {
            title: "Data Explorer Entity List View Layout",
            path: ":name",
            element: () => <ListViewPage />,
            icon: <></>
        }
    ]
}))

