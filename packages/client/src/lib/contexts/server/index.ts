import { proxy, useSnapshot } from "valtio"

export type ServerContext = {
    serverUrl?: string
}

export const ServerContext = proxy<ServerContext>({})
export const useServerContext = () => useSnapshot(ServerContext)