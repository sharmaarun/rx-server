import { registerCoreRoute, registerRootRoute, registerRoute } from "@reactive/client"
import { RXICO_MONITOR } from "@reactive/icons"
import { Outlet } from "react-router-dom"
import MediaListPage from "./pages/list"



registerRoute(ctx => ({
    title: "Media Gallery",
    path: "/media",
    element: Outlet,
    icon: () => <RXICO_MONITOR />,
    // children: [
    //     {
    //         title: "List Media",
    //         path: "/",
    //         element: MediaListPage,
    //         icon: () => <></>,

    //     }
    // ]
}))
