import { proxy, useSnapshot } from "valtio"
import { FieldsContext } from "../fields"
import { RoutesContext } from "../routes"

export type ClientContext = {
    name: string,
    routes: RoutesContext
    fields: FieldsContext
}

export const ClientContext = proxy<ClientContext>({
    name: "rx-server",
    routes: RoutesContext,
    fields: FieldsContext
})

export const useClientContext = () => useSnapshot(ClientContext)