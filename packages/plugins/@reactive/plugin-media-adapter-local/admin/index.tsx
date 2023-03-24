import { registerAttributeType, registerRoute } from "@reactive/client"
import { BaseAttributeType, RelationType } from "@reactive/commons"
import { RXICO_FOCUS, RXICO_MONITOR } from "@reactive/icons"
import { Outlet } from "react-router-dom"
import { MediaAttributeEditor } from "./components/attribute-editor"
import { MediaAttributeValueEditor } from "./components/value-editor"
import MediaListPage from "./pages/list"



registerRoute(ctx => ({
    title: "Media Gallery",
    path: "/media",
    element: Outlet,
    icon: () => <RXICO_MONITOR />,
    children: [
        {
            title: "List Media",
            path: "",
            element: MediaListPage,
            icon: () => <></>,

        }
    ]
}))

registerAttributeType(ctx => ({
    attribute: {
        type: BaseAttributeType.json,
        customType: "media"
    },
    metadata: {
        icon: RXICO_FOCUS,
        components: {
            attributeEditor: MediaAttributeEditor,
            valueEditor: { span: 6, component: MediaAttributeValueEditor }
        }
    }
}))