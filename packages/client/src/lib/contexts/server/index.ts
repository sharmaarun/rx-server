import { Endpoint } from "@reactive/commons"
import { proxy, useSnapshot } from "valtio"

export type ServerContext = {
    serverUrl?: string
    endpoints?: Endpoint[]
}

export const ServerContext: ServerContext = proxy<ServerContext>({})
export const useServerContext = () => useSnapshot(ServerContext)