import { Plugin } from "@reactive/commons"
import { proxy, useSnapshot } from "valtio"
import { PluginClass } from "../../plugins"
export type PluginsContext = {
    plugins: (PluginClass | Plugin)[]
}

export const PluginsContext: PluginsContext = proxy<PluginsContext>({
    plugins: []
})

export const usePluginsContext = () => useSnapshot(PluginsContext)