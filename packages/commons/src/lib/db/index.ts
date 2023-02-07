import { ColumnOptions, ColumnType, EntitySchema as ES, EntitySchemaColumnOptions } from "typeorm"
export type DBConfig = {
    adapter: string
    options: DBConnectionOpts
}

export type DBConnectionOpts = {
    type?: string
    protocol?: string
    host?: string
    port?: number
    username?: string
    password?: string
    database?: string,
    logging?: any
}

export enum BaseFieldType {
    "string" = "string",
    "number" = "number",
    "boolean" = "boolean",
    "json" = "json",
    "date" = "date",
    "enum" = "enum",
    "uuid" = "uuid",
    "relation" = "relation"
}

export enum RelationType {
    ONE_TO_ONE = "1:1",
    ONE_TO_MANY = "1:m",
    MANY_TO_ONE = "m:1",
    MANY_TO_MANY = "m:m",
    HAS_ONE = "[1]",
    HAS_MANY = "[m]"
}

export type RefType = {
    entity: string
    key?: string
    relation?: RelationType
}

export type Field = {
    name: string
    type: BaseFieldType
    ref?: RefType
}

export type EntitySchema = {
    name: string,
    columns?: {
        [key: string | symbol]: Field
    }
}

export type WhereOptionsAttrs = {
    attributes?: any
}

export type WhereOptions<T = any> = T extends T ? Partial<T> & WhereOptionsAttrs : WhereOptionsAttrs;

export type Query<T = any> = {
    where?: WhereOptions<T>
    include?: string[],
    offset?: number,
    limit?: number,
    group?: string,
    order?: string[]
}