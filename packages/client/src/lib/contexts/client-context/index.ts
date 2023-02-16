import { proxy, useSnapshot } from "valtio"
import { AttributesContext } from "../attributes"
import { RoutesContext } from "../routes"
import { ServerContext } from "../server"

export type ClientContext = {
    name: string,
    routes: RoutesContext
    attributes: AttributesContext
    server: ServerContext
}

export const ClientContext = proxy<ClientContext>({
    name: "rx-server",
    routes: RoutesContext,
    attributes: AttributesContext,
    server: ServerContext
})

export const useClientContext = () => useSnapshot(ClientContext)