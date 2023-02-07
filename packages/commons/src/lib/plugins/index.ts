export type PluginOpts<T = any> = {
    name: string
    options?: T
}

export type Plugin<T = any> = (ctx: T) => void | Promise<void>

export type PluginClass<T = any> = {
    init: (otps: T) => void | Promise<void>
    start?: () => void | Promise<void>
}


export type PluginsConfig = {
    v?: string
    relativePaths: string[],
    plugins: PluginOpts[],
}

export const PLUGINS_WEB_ROOT = "plugins:plugins"