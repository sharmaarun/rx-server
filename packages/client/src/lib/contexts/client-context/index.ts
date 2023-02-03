import { proxy, useSnapshot } from "valtio"
import { Routes, RoutesContext } from "../routes"

export type ClientContext = {
    name: string,
    routes: RoutesContext
}

export const ClientContext = proxy<ClientContext>({
    name: "rx-server",
    routes: Routes
})

export const useClientContext = () => useSnapshot(ClientContext)