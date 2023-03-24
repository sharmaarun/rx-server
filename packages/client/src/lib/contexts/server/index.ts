import { Endpoint } from "@reactive/commons"
import { proxy, useSnapshot } from "valtio"

export type ServerContext = {
    host?: string
    port?: number
    webRoot?: string
    endpoints?: Endpoint[]
}

export const ServerContext: ServerContext = proxy<ServerContext>({})
export const useServerContext = () => useSnapshot(ServerContext)