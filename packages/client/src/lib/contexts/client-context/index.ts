import { proxy, useSnapshot } from "valtio"
import { AttributesContext } from "../attributes"
import { MenusContext } from "../menu"
import { PluginsContext } from "../plugins"
import { RoutesContext } from "../routes"
import { ServerContext } from "../server"

export type ClientContext = {
    name: string,
    routes: RoutesContext
    attributes: AttributesContext
    server: ServerContext
    plugins: PluginsContext
    menus: MenusContext

}

export const ClientContext: ClientContext = proxy<ClientContext>({
    name: "rx-server",
    routes: RoutesContext,
    attributes: AttributesContext,
    server: ServerContext,
    plugins: PluginsContext,
    menus: MenusContext
})

export const useClientContext = () => useSnapshot(ClientContext)