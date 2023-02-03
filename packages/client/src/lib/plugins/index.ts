import { ClientContext } from "../contexts"

export interface PluginClass<T = any> {
    init: (ctx: ClientContext) => void
}

