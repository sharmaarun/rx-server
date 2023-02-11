import { ColumnOptions, ColumnType, EntitySchema as ES, EntitySchemaColumnOptions } from "typeorm"
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
    autoExtendEntitiesFromCore?:boolean
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


export const BasicFieldValidations = {
    "is": { title: "is" },
    "not": { title: "not" },
    "isEmail": { title: "isEmail" },
    "isUrl": { title: "isUrl" },
    "isIP": { title: "isIP" },
    "isIPv4": { title: "isIPv4" },
    "isIPv6": { title: "isIPv6" },
    "isAlpha": { title: "isAlpha" },
    "isAlphanumeric": { title: "isAlphanumeric" },
    "isNumeric": { title: "isNumeric" },
    "isInt": { title: "isInt" },
    "isFloat": { title: "isFloat" },
    "isDecimal": { title: "isDecimal" },
    "isLowercase": { title: "isLowercase" },
    "isUppercase": { title: "isUppercase" },
    "notNull": { title: "notNull" },
    "isNull": { title: "isNull" },
    "notEmpty": { title: "notEmpty" },
    "equals": { title: "equals" },
    "contains": { title: "contains" },
    "notIn": { title: "notIn" },
    "isIn": { title: "isIn" },
    "notContains": { title: "notContains" },
    "len": { title: "len" },
    "isUUID": { title: "isUUID" },
    "isDate": { title: "isDate" },
    "isAfter": { title: "isAfter" },
    "isBefore": { title: "isBefore" },
    "max": { title: "max" },
    "min": { title: "min" },
    "isCreditCard": { title: "isCreditCard" },
}

export type BasicFieldValidationType = keyof typeof BasicFieldValidations

export type BasicFieldValidation = {
    type: BasicFieldValidationType
    value: any
}

export type RefType = {
    relationType?: RelationType
    entityName: string
    foreignKey?: string
}

export type FieldType = {
    name: string
    type: BaseFieldType
    customType?: string
    ref?: RefType
}

export class Field {
    constructor(opts: FieldType) {
        Object.assign(this, opts)
    }
    public name!: string
    public type!: BaseFieldType
    public customType?: string
    public defaultValue?: string
    public isUnique?: boolean
    public isPrimary?: boolean
    public allowNull?: boolean
    public validations?: BasicFieldValidation[]
    public ref?: RefType
    public autoIncrement?: boolean
}

export type EntitySchema = {
    name: string,
    columns?: Field[]
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