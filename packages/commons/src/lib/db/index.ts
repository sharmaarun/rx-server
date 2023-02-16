export type DBConfig = {
    adapter: string
    options: DBConnectionOpts
}

export type DBConnectionOpts = {
    // dialact for sequelize
    type?: string
    /**  protocol for the connection eg. mysql:// */
    protocol?: string
    /** host name eg. 0.0.0.0 */
    host?: string
    /**
     *  connection port eg. 3696
     */
    port?: number
    username?: string
    password?: string
    database?: string,
    /**
     * Enum values (used by ENUM field type)
     */
    values?: string[]
    /**
     *  enable / disable logging
     */
    logging?: any,
    /**
     * should the table names be pluaralized
     */
    freezeTableName?: boolean
    /**
     * enable / disable timestamps (createdAt, updatedAt)
     */
    timestamps?: boolean
    /**
     * Auto extend entities from the base entity (with id, createdAt, updatedAt , __v etc fields)
     */
    autoExtendEntitiesFromCore?: boolean
}

export enum BaseAttributeType {
    "string" = "string",
    "number" = "number",
    "boolean" = "boolean",
    "json" = "json",
    "date" = "date",
    "enum" = "enum",
    "uuid" = "uuid",
    "relation" = "relation"
}

export enum StringAttributeSubType {
    "varchar" = "varchar",
    "text" = "text",
    "tiny" = "tiny"
}

export enum NumberAttributeSubType {
    "integer" = "integer",
    "float" = "float",
    "double" = "double",
    "decimal" = "decimal",
}

export enum DateAttributeSubType {
    "date" = "date",
    "datetime" = "datetime"
}

export enum RelationType {
    ONE_TO_ONE = "1:1",
    ONE_TO_MANY = "1:m",
    MANY_TO_ONE = "m:1",
    MANY_TO_MANY = "m:m",
    HAS_ONE = "[1]",
    HAS_MANY = "[m]"
}


export enum BasicAttributeValidation {
    "is" = "is",
    "not" = "not",
    "isEmail" = "isEmail",
    "isUrl" = "isUrl",
    "isIP" = "isIP",
    "isIPv4" = "isIPv4",
    "isIPv6" = "isIPv6",
    "isAlpha" = "isAlpha",
    "isAlphanumeric" = "isAlphanumeric",
    "isNumeric" = "isNumeric",
    "isInt" = "isInt",
    "isFloat" = "isFloat",
    "isDecimal" = "isDecimal",
    "isLowercase" = "isLowercase",
    "isUppercase" = "isUppercase",
    "notNull" = "notNull",
    "isNull" = "isNull",
    "notEmpty" = "notEmpty",
    "equals" = "equals",
    "contains" = "contains",
    "notIn" = "notIn",
    "isIn" = "isIn",
    "notContains" = "notContains",
    "len" = "len",
    "isUUID" = "isUUID",
    "isDate" = "isDate",
    "isAfter" = "isAfter",
    "isBefore" = "isBefore",
    "max" = "max",
    "min" = "min",
    "isCreditCard" = "isCreditCard",
}

export type BasicAttributeValidationType = {
    type: BasicAttributeValidation
    value: any
}


export class Attribute {
    constructor(opts: typeof Attribute) {
        Object.assign(this, opts)
    }
    public name!: string
    public type!: BaseAttributeType
    public subType?: StringAttributeSubType | NumberAttributeSubType | DateAttributeSubType
    public customType?: string
    public defaultValue?: string
    public isUnique?: boolean
    public validations?: BasicAttributeValidationType[]
    public ref?: string
    public relationType?: RelationType
    public foreignKey?: string
    public autoIncrement?: boolean
    public values?: string[]
    public isRequired?: boolean
}

export type EntityMappedAttributes<T = any> = {
    [k in keyof T]: Attribute
}
export type EntityAnyAttributes = {
    [k: string]: Attribute
}

export type EntityAttributes<T = any> = EntityMappedAttributes<T> & EntityAnyAttributes

export interface EntitySchema<T = any> {
    name: string,
    attributes?: EntityAttributes<T>
}

export interface CoreAttributesType {
    id: Attribute
}

export class CoreAttributes {
    public id!: string
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