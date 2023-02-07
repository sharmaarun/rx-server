import { APIRoute, APIRouteHandlersMap } from "../api";
import { EntitySchema } from "../db";

export type EndpointType = "core" | "plugin" | "basic"

export type Endpoint = {
    name: string;
    controllers?: APIRouteHandlersMap
    routes?: APIRoute[]
    services?: any[]
    schema?: EntitySchema
    type?: EndpointType
}