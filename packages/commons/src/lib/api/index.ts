export type APIRouteMethod = "post" | "get" | "put" | "delete" | "patch" | "options"

export type APIRoute = {
    path: string,
    method: APIRouteMethod
    handler?: string,
    staticPath?: string
}

export type APIRequestContext = {
    params: any
    query: any
    body: any
    send: (data?: any) => void
    header: (key: string, value: string) => void
}

export type APIRouteHandler = (ctx: APIRequestContext) => any | Promise<any>

export type APIRouteHandlersMap = {
    [key: string]: APIRouteHandler
}

export type APIConfig = {
    path: string
    webRoot: string
}