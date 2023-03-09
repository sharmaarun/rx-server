import { Query } from "../db"
import { Endpoint } from "../endpoints"

export type APIRouteMethod = "post" | "get" | "put" | "delete" | "patch" | "options"

export type APIRoute = {
    path: string,
    method: APIRouteMethod
    handler?: string,
    staticPath?: string
}

export interface APIRequestContext<P = any, Q = any, B = any> {
    params: P
    query: Q extends Q ? Partial<Q> & Query<Q> : Query<Q>,
    body: B
    send: (data?: any) => void
    header: (key: string, value: string) => void
    headers: any,
    endpoint: Endpoint
    route: APIRoute
}

export type APIRouteMiddleware = {
    endpointName: string | RegExp,
    route: {
        path: string | RegExp,
        method: string | RegExp
    },
    handler: (ctx: APIRequestContext) => void | Promise<void>
}

export type APIRouteHandler = (ctx: APIRequestContext) => any | Promise<any>

export type APIRouteHandlersMap = {
    [key: string]: APIRouteHandler
}

export type APIConfig = {
    path: string
    webRoot: string
}