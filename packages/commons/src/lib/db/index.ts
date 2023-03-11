import { contains, isEmpty, IsNotEmpty, max, maxLength, min, minLength, ValidationError } from "class-validator"

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
    "matches" = "matches",
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
    // "notNull" = "notNull",
    // "isNull" = "isNull",
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
    "maxLen" = "maxLen",
    "min" = "min",
    "minLen" = "minLen",
    "isCreditCard" = "isCreditCard",
}

export enum Operator {
    "eq" = "eq",
    "ne" = "ne",
    "gte" = "gte",
    "gt" = "gt",
    "lte" = "lte",
    "lt" = "lt",
    "not" = "not",
    "is" = "is",
    "in" = "in",
    "notIn" = "notIn",
    "like" = "like",
    "notLike" = "notLike",
    "iLike" = "iLike",
    "notILike" = "notILike",
    "startsWith" = "startsWith",
    "endsWith" = "endsWith",
    "substring" = "substring",
    "regexp" = "regexp",
    "notRegexp" = "notRegexp",
    "iRegexp" = "iRegexp",
    "notIRegexp" = "notIRegexp",
    "between" = "between",
    "notBetween" = "notBetween",
    "contains" = "contains",
    "values" = "values",
    "and" = "and",
    "or" = "or",
    "any" = "any",
    "all" = "all",
    // "overlap" = "overlap",
    // "contained" = "contained",
    // "adjacent" = "adjacent",
    // "strictLeft" = "strictLeft",
    // "strictRight" = "strictRight",
    // "noExtendRight" = "noExtendRight",
    // "noExtendLeft" = "noExtendLeft",
    // "col" = "col",
    // "placeholder" = "placeholder",
    // "join" = "join",
    // "match" = "match",
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
    /**
     * Custom type is used by frontend for mapping to
     * corresponding attribute type
     */
    public customType?: string
    public defaultValue?: string
    public isUnique?: boolean
    public validations?: BasicAttributeValidationType[]
    /**
     * Name of the referered entity
     */
    public ref?: string
    public relationType?: RelationType
    /**
     * Indicated the attribute name in the ref entity
     * pointing to this entity
     */
    public foreignKey?: string
    public autoIncrement?: boolean
    public values?: string[]
    public isRequired?: boolean
    public isTarget?: boolean
    /**
     * Indicates if this attribute is editable
     * in the entity editor
     */
    public editable?: boolean
    /**
     * Indicates if this attribute is hidden
     * in the entity editor
     */
    public hidden?: boolean
    /**
     * Indicates if this attribute's value should 
     * be stripped from the results
     */
    public private?: boolean
    /**
     * Indicates if this attribute is freezed
     * in the entity attributes editor
     */
    public locked?: boolean
    /**
     * JSON meta fields (for extension)
     */
    public meta?: any
}

export type EntityMappedAttributes<T = any> = {
    [k in keyof T]: Attribute
}
export type EntityAnyAttributes = {
    [k: string]: Attribute
}

export type EntityAttributes<T = any> = EntityMappedAttributes<T> & EntityAnyAttributes

/**
 * Entity schema type
 * fs: schema is present in the file system (project's api dir)
 * inmemory: schema was loaded manually (by plugin or similar)
 */
export type EntitySchemaType = "fs" | "inmemory"

export interface EntitySchema<T = any> {
    name: string,
    attributes?: EntityAttributes<T>
    /**
     * type of this entity schema
     */
    type?: EntitySchemaType
}

export interface CoreAttributesType {
    id: Attribute
}

export class CoreAttributes {
    public id!: string
}

export type WhereOptionsQuery = {
    [key in Operator]?: any
}

export type WhereOptionsAttrs = {
    [k: string | symbol | number]: WhereOptionsQuery
}

export type WhereOptions<T = any> = T extends T ? Partial<T> & WhereOptionsAttrs : WhereOptionsAttrs;

export type QueryPagination = {
    page?: number,
    pageSize?: number
}

export type QueryOrderItemDirection<T = any> = T extends T ? "DESC" | "ASC" | "desc" | "asc" : T
/**
 * [attribute name,order]
 */
export type QueryOrderItem = string | [string, QueryOrderItemDirection]
export type QueryOrder = string | string[] | QueryOrderItem[]

export type QueryGroup = string | string[]

export type QueryIncludeOpts<T = any> = {
    association?: string
    attributes?: string[]
    where?: WhereOptions<T>
}

export type Query<T = any> = {
    where?: WhereOptions<T>
    include?: (string | QueryIncludeOpts<T>)[]
    attributes?: string[]
    pagination?: QueryPagination
    group?: QueryGroup
    order?: QueryOrder
}

export type FindAndCountAllReturnType<T = any> = {
    rows: T[],
    count: number
}


export type ValidateEntityOptions = {

}

export type DefaultEntityAttributes = {
    id?: number | string
    createdAt?: Date | string
    updatedAt?: Date | string
}


/**
 * ============= Impls
 */

/**
 * Validates the data based on the attribute validations present in the specified schema
 * @param schema Schema to use for validation
 * @param data Data to validate
 * @param opts (optional)
 */
export const validateEntity = (schema: EntitySchema, data?: any, opts?: ValidateEntityOptions) => {
    const errors: ValidationError[] = []
    // for all the attributes
    for (let attr of Object.values(schema.attributes || {})) {
        // for each validation existing in this attribute
        const constraints: any = {}
        const value = data?.[attr.name]

        // check for attribute.isRequired
        if (attr.isRequired) {
            const msg = validateValue(value, { type: BasicAttributeValidation.notEmpty, value: "" })
            if (msg?.length) {
                constraints[BasicAttributeValidation.notEmpty] = msg
            }
        }
        //check for custom validations
        for (let validation of (attr.validations || [])) {
            // validate the data property
            const msg = validateValue(value, validation)
            if (msg?.length) {
                constraints[validation.type] = msg
            }
        }
        if (Object.keys(constraints).length) {
            const error = new ValidationError()
            error.property = attr.name
            error.constraints = constraints
            error.target = data
            error.value = value
            errors.push(error)
        }
    }
    return errors
}

/**
 * Validates a single value for specified validation type
 * @param value 
 * @param validation 
 */
export const validateValue = (value: any, { type, value: tvalue }: BasicAttributeValidationType) => {
    let msg;
    switch (type) {
        case BasicAttributeValidation.notEmpty:
            msg = isEmpty(value) ? `Is required` : ""
            break;
        case BasicAttributeValidation.contains:
            msg = !contains(value, tvalue) ? `Should contain ${tvalue}` : ""
            break;
        case BasicAttributeValidation.min:
            msg = !min(value, tvalue) ? `Should be more than ${tvalue}` : ""
            break;
        case BasicAttributeValidation.max:
            msg = !max(value, tvalue) ? `Should be less than ${tvalue}` : ""
            break;
        case BasicAttributeValidation.minLen:
            msg = !minLength(value, tvalue) ? `Length should be more than ${tvalue} characters` : ""
            break;
        case BasicAttributeValidation.maxLen:
            msg = !maxLength(value, tvalue) ? `Length should be less than ${tvalue} characters` : ""
            break;
        case BasicAttributeValidation.matches:
            msg = !new RegExp(tvalue).test(value) ? `Invalid value` : ""
            break;
        default:
            break;
    }

    return msg
}