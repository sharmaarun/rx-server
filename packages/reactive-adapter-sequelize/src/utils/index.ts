import { BaseAttributeType, DateAttributeSubType, NumberAttributeSubType, StringAttributeSubType } from "@reactive/commons";
import { DataType, DataTypes, Op } from "sequelize";

export type TypeMap = {
    [key in BaseAttributeType]: DataType;
};

export type SubTypeMap = {
    [key in
    keyof TypeMap |
    StringAttributeSubType |
    NumberAttributeSubType |
    DateAttributeSubType
    ]: DataType;
};

export const TypeMap: TypeMap = {
    [BaseAttributeType.string]: DataTypes.STRING,
    [BaseAttributeType.boolean]: DataTypes.BOOLEAN,
    [BaseAttributeType.date]: DataTypes.DATEONLY,
    [BaseAttributeType.enum]: DataTypes.ENUM,
    [BaseAttributeType.json]: DataTypes.JSON,
    [BaseAttributeType.number]: DataTypes.INTEGER,
    [BaseAttributeType.relation]: DataTypes.STRING,
    [BaseAttributeType.uuid]: DataTypes.UUID,
}
export const SubTypeMap: SubTypeMap = {
    ...TypeMap,
    [StringAttributeSubType.varchar]: DataTypes.STRING,
    [StringAttributeSubType.text]: DataTypes.TEXT,
    [StringAttributeSubType.tiny]: DataTypes.TEXT('tiny'),
    [NumberAttributeSubType.decimal]: DataTypes.DECIMAL,
    [NumberAttributeSubType.double]: DataTypes.DOUBLE,
    [NumberAttributeSubType.float]: DataTypes.FLOAT,
    [NumberAttributeSubType.integer]: DataTypes.INTEGER,
    [DateAttributeSubType.datetime]: DataTypes.DATE,
}

export const DefaultValueMap = {
    [BaseAttributeType.string]: "",
    [BaseAttributeType.boolean]: false,
    [BaseAttributeType.date]: new Date(),
    [BaseAttributeType.enum]: "",
    [BaseAttributeType.json]: "{}",
    [BaseAttributeType.number]: 0,
    [BaseAttributeType.relation]: 0,
    [BaseAttributeType.uuid]: 0,
    [StringAttributeSubType.varchar]: "",
    [StringAttributeSubType.text]: "",
    [StringAttributeSubType.tiny]: "",
    [NumberAttributeSubType.decimal]: 0.0,
    [NumberAttributeSubType.double]: 0,
    [NumberAttributeSubType.float]: 0.0,
    [NumberAttributeSubType.integer]: 0,
    [DateAttributeSubType.datetime]: new Date(),
}


export const OperatorsMap: any = {
    "eq": Op.eq,
    "ne": Op.ne,
    "gte": Op.gte,
    "gt": Op.gt,
    "lte": Op.lte,
    "lt": Op.lt,
    "not": Op.not,
    "is": Op.is,
    "in": Op.in,
    "notIn": Op.notIn,
    "like": Op.like,
    "notLike": Op.notLike,
    "iLike": Op.iLike,
    "notILike": Op.notILike,
    "startsWith": Op.startsWith,
    "endsWith": Op.endsWith,
    "substring": Op.substring,
    "regexp": Op.regexp,
    "notRegexp": Op.notRegexp,
    "iRegexp": Op.iRegexp,
    "notIRegexp": Op.notIRegexp,
    "between": Op.between,
    "notBetween": Op.notBetween,
    "overlap": Op.overlap,
    "contains": Op.contains,
    "contained": Op.contained,
    "adjacent": Op.adjacent,
    "strictLeft": Op.strictLeft,
    "strictRight": Op.strictRight,
    "noExtendRight": Op.noExtendRight,
    "noExtendLeft": Op.noExtendLeft,
    "and": Op.and,
    "or": Op.or,
    "any": Op.any,
    "all": Op.all,
    "values": Op.values,
    "col": Op.col,
    "placeholder": Op.placeholder,
    "match": Op.match,
}
