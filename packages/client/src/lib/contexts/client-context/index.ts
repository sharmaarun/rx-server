import { proxy, useSnapshot } from "valtio"
import { AttributesContext } from "../attributes"
import { PluginsContext } from "../plugins"
import { RoutesContext } from "../routes"
import { ServerContext } from "../server"
import { useNavigate, useLocation, Routes, useRoutes, NavigateFunction, Location } from "react-router-dom"
export type ClientContext = {
    name: string,
    routes: RoutesContext
    attributes: AttributesContext
    server: ServerContext
    plugins: PluginsContext
    utils: {
        router: {
            navigate?: NavigateFunction,
            location?: Location,
            routes?: typeof Routes,
        }

    }
}

export const ClientContext: ClientContext = proxy<ClientContext>({
    name: "rx-server",
    routes: RoutesContext,
    attributes: AttributesContext,
    server: ServerContext,
    plugins: PluginsContext,
    utils: {
        router: {

        }
    }
})

export const useClientContext = () => useSnapshot(ClientContext)