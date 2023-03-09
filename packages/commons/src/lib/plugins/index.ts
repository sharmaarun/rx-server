export type PluginOpts<T = any> = {
    name: string
    options?: T
}

export type Plugin<O = any, T = any> = (ctx: T, options?: O) => void | Promise<void>

export type PluginClass<O = any, T = any> = {
    ctx: T
    options?: O,
    init: (ctx: T, options?: O) => void | Promise<void>
    start?: () => void | Promise<void>
}


export type PluginsConfig = {
    v?: string
    relativePaths: string[],
    plugins: PluginOpts[],
}

export const PLUGINS_WEB_ROOT = "plugins_plugins"