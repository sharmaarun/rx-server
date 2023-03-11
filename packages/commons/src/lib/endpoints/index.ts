import { APIRoute, APIRouteHandlersMap } from "../api";
import { EntitySchema } from "../db";

export type EndpointType = "core" | "plugin" | "basic"

export type Endpoint = {
    /**
     * Unique name for this endpoint
     */
    name: string;
    /**
     * Optional title (if not provided, name field will be used)
     */
    title?: string;
    /**
     * Controllers for this endpoint
     */
    controllers?: APIRouteHandlersMap
    /**
     * Routes for this endpoint
     */
    routes?: APIRoute[]
    /**
     * Services attached to this endpoint
     */
    services?: any[]
    /**
     * Default database entity schema for this endpoint
     */
    schema?: EntitySchema
    /**
     * Type of this endpoint
     */
    type?: EndpointType
}