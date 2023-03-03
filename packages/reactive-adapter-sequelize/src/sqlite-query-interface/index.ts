import { Attribute, BaseAttributeType, BasicAttributeValidation, EntitySchema, RelationType } from "@reactive/commons";
import { QueryInterface, QueryInterfaceOptions } from "@reactive/server";
import { DataTypes, QueryTypes, Transaction } from "sequelize";
import { SequelizeAdapter } from "../adapter";
import { SubTypeMap, DefaultValueMap, TypeMap } from "../utils"


/**
 * Create/Add column options
 */
export type CreateColumnOpts = QueryInterfaceOptions & {
}

/**
 * Create table options
 */
export type CreateTableOpts = QueryInterfaceOptions & {
    /**
     * True by default
     */
    skipRelational?: boolean
}

/**
 * Drop/Remove table options
 */
export type DropTableOpts = QueryInterfaceOptions & {
    force?: boolean
}

/**
 * Rename column options
 */
export type RenameColumnOpts = QueryInterfaceOptions & {}

/**
 * Add new attribute options
 */
export type AddAttributeOpts = QueryInterfaceOptions & {}

/**
 * Remove existing attribute options
 */
export type RemoveAttributeOpts = QueryInterfaceOptions & {}

/**
 * Change existing attribute options
 */
export type ChangeAttributeOpts = QueryInterfaceOptions & {}


/**
 * SQL Query interface adapter
 * 
 * Interacts with the low level layer (query interface) of the sequelize ORM
 */
export class SQLiteQueryInterfaceAdapter extends QueryInterface {
    constructor(
        private adapter: SequelizeAdapter,
    ) {
        super()
    }

    /**
     * Create a table in db
     * @param tableName Name of the table/entity
     * @param attributes Array of all the attributes/columns to create in this table
     * @param attributes Attributes to create (optional)
     */
    async createTable(tableName: string, attributes: Attribute[], opts?: CreateTableOpts) {
        const { skipRelational = true } = opts || {}
        const trx: Transaction = opts?.transaction || await this.adapter.transaction()
        try {
            const cols: any = {}
            const relationalAttributes = attributes.filter(attr => attr.type === BaseAttributeType.relation)
            const simpleAttributes = attributes.filter(attr => attr.type !== BaseAttributeType.relation)

            // for simple attributes, prepare columns
            simpleAttributes.forEach(attr => {
                cols[attr.name] = this.prepareColumn(attr)
            })
            if (!cols || Object.values(cols)?.length <= 0) throw new Error(`Entity: "${tableName}" should have at least one non-relational attribute!`)

            // create the table with the prepared columns
            const res = await this.qi.createTable(tableName, cols, { transaction: trx })

            // create relational columns if not skipped
            if (!skipRelational) {
                for (let attr of relationalAttributes) {
                    await this.addRelationalColumn(tableName, attr, { transaction: trx })
                }
            }

            if (!opts?.transaction) await trx.commit()
            return res
        } catch (e: any) {
            if (!opts?.transaction) await trx.rollback()
            console.error(e.message)
            throw e
        }
    }

    /**
     * Drop a table in db
     * @param tableName Name of the table/entity
     * @param attributes Attributes to create (optional)
     */
    async dropTable(tableName: string, opts?: DropTableOpts) {
        const trx: Transaction = opts?.transaction || await this.adapter.transaction()
        try {
            const res = await this.qi.dropTable(tableName, { ...(opts || {}), transaction: trx })
            if (!opts?.transaction) await trx.commit()
            return res
        } catch (e: any) {
            if (!opts?.transaction) await trx.rollback()
            console.error(e.message)
            throw e
        }
    }

    /**
     * Describes a table schema
     * @param tableName Name of the table
     * @param opts Describe options (optional)
     */
    async describe(tableName: string, opts?: QueryInterfaceOptions) {
        const trx: Transaction = opts?.transaction || await this.adapter.transaction()
        try {
            const res = await this.qi.describeTable(tableName)
            if (!opts?.transaction) await trx.commit()
            return res
        }
        catch (e: any) {
            if (!opts?.transaction) await trx.rollback()
            console.error(e.message)
            throw e
        }
    }

    /**
     * Drop a table in db
     * @param tableName Name of the table/entity
     * @param attributes Attributes to create (optional)
     */
    async tableExists(tableName: string, opts?: QueryInterfaceOptions) {
        const trx: Transaction = opts?.transaction || await this.adapter.transaction()
        try {
            const res = await this.qi.tableExists(tableName, { transaction: trx })
            if (!opts?.transaction) await trx.commit()
            return res
        }
        catch (e: any) {
            if (!opts?.transaction) await trx.rollback()
            console.warn(e.message)
            return false
        }

    }


    /**
     * Add a new column to the database
     * @param tableName Name of the table
     * @param opts Add column options
     */
    async addColumn(tableName: string, attribute: Attribute, opts?: CreateColumnOpts) {
        const trx: Transaction = opts?.transaction || await this.adapter.transaction()
        try {
            const res = await this.qi.addColumn(
                tableName,
                attribute.name,
                this.prepareColumn(attribute),
                { transaction: trx }
            )
            if (!opts?.transaction) await trx.commit()
            return res
        }
        catch (e: any) {
            if (!opts?.transaction) await trx.rollback()
            console.error(e.message)
            throw e
        }
    }


    /**
     * Migrate/Change an existing column in the database
     * @param schema Entity schema
     * @param oldAttribute Old unmodified attribute
     * @param newAttribute New changed attribute
     * @param opts (optional)
     * @returns 
     */
    async changeColumn(schema: EntitySchema, oldAttribute: Attribute, newAttribute: Attribute, opts?: QueryInterfaceOptions) {
        const trx = opts?.transaction || await this.ds.transaction()
        let res: any;
        try {

            // if isRequired, defaultValue changed
            if (
                oldAttribute.isRequired !== newAttribute.isRequired ||
                JSON.stringify(oldAttribute.defaultValue) !== JSON.stringify(newAttribute.defaultValue)
            ) {
                // remove old column
                await this.removeColumn(schema.name, oldAttribute.name, { transaction: trx })

                // add new col
                await this.addColumn(schema.name, newAttribute, { transaction: trx })
            }

            // if name changed, rename the column in the db
            if (oldAttribute.name !== newAttribute.name) {
                await this.renameColumn(schema.name, oldAttribute.name, newAttribute.name, { transaction: trx })
            }

            if (!opts?.transaction) await trx.commit()
            return res
        } catch (e: any) {
            if (!opts?.transaction) await trx.rollback()
            console.error(e.message)
            throw e
        }
    }

    /**
     * Rename existing column in database
     * @param tableName Table name
     * @param from Old name of the column
     * @param to New name of the column
     * @param opts (optional)
     * @returns 
     */
    async renameColumn(tableName: string, from: string, to: string, opts?: RenameColumnOpts) {
        const trx: Transaction = opts?.transaction || await this.adapter.transaction()
        try {
            const res = await this.qi.renameColumn(tableName, from, to, { transaction: trx })
            if (!opts?.transaction) await trx.commit()
            return res
        }
        catch (e: any) {
            if (!opts?.transaction) await trx.rollback()
            console.error(e.message)
            throw e
        }
    }

    /**
     * Remove a column from the database
     * @param tableName Name of the table
     * @param name Column name to remove
     * @param opts (optional)
     * @returns 
     */
    async removeColumn(tableName: string, name: string, opts?: QueryInterfaceOptions) {
        const trx: Transaction = opts?.transaction || await this.adapter.transaction()
        try {
            let res: any;
            const exists = await this.columnExists(tableName, name, { transaction: trx })
            if (exists) {
                res = await this.ds.query(`
                ALTER TABLE ${tableName}
                DROP COLUMN ${name}
                `, { ...(opts || {}), transaction: trx })
            } else {
                console.warn(`Attempt to delete a table column ${tableName}(${name}), which doesn't exist!`)
            }
            if (!opts?.transaction) await trx.commit()
            return res
        }
        catch (e: any) {
            if (!opts?.transaction) await trx.rollback()
            console.error(e.message)
            throw e
        }
    }

    /**
     * Check if a column exists in the table or not
     * @param tableName Table name
     * @param name Name of the column to check
     * @param opts (optional)
     * @returns 
     */
    async columnExists(tableName: string, name: string, opts?: QueryInterfaceOptions) {
        const trx: Transaction = opts?.transaction || await this.adapter.transaction()
        try {
            let res: any;

            res = await this.ds.query(`
            SELECT ${name} FROM ${tableName}
            `, { transaction: trx })

            if (!opts?.transaction) await trx.commit()
            return true
        }
        catch (e: any) {
            if (!opts?.transaction) await trx.rollback()
            console.warn(e.message)
            return false
        }
    }

    /**
     * Create [1] (Has one) relational columns in the database\
     * 
     * Creates a column with name `${attribute.foreignKey}Id` in the `${attribute.ref}` table
     * which references current `tableName`'s `id` column
     * @param tableName Name of the table/entity
     * @param attribute Attribute to create relational columns for
     * @param opts (optional)
     */
    async addRelationalColumnsForHasOne(tableName: string, attribute: Attribute, opts?: QueryInterfaceOptions) {
        if (attribute.isTarget) throw new Error(`Can't generate relations for an attribute which is on the target side of a relation : ${attribute.name}`)
        const trx: Transaction = opts?.transaction || await this.adapter.transaction()
        try {
            let res: any;

            // perform basic validations
            const { ref, foreignKey } = attribute || {}
            if (!ref || !foreignKey) throw new Error(`Invalid relational attribute : ${JSON.stringify(attribute)}`)

            // create new column in the ref table
            res = await this.addColumn(ref, {
                name: foreignKey + "Id",
                type: BaseAttributeType.relation,
                ref: tableName
            }, { transaction: trx })

            if (!opts?.transaction) await trx.commit()
            return res;
        } catch (e: any) {
            if (!opts?.transaction) await trx.rollback()
            console.error(e.message)
            throw e
        }
    }

    /**
     * Create [M] (Has many) relational columns in the database\
     * 
     * Creates a column with name `${attribute.foreignKey}Id` in the `${attribute.ref}` table
     * which references current `tableName`'s `id` column
     * @param tableName Name of the table/entity
     * @param attribute Attribute to create relational columns for
     * @param opts (optional)
     */
    async addRelationalColumnsForHasMany(tableName: string, attribute: Attribute, opts?: QueryInterfaceOptions) {
        if (attribute.isTarget) throw new Error(`Can't generate relations for an attribute which is on the target side of a relation : ${attribute.name}`)
        const trx: Transaction = opts?.transaction || await this.adapter.transaction()
        try {
            let res: any;

            // perform basic validations
            const { ref, foreignKey } = attribute || {}
            if (!ref || !foreignKey) throw new Error(`Invalid relational attribute : ${JSON.stringify(attribute)}`)

            // create new column in the ref table
            res = await this.addColumn(ref, {
                name: foreignKey + "Id",
                type: BaseAttributeType.relation,
                ref: tableName
            }, { transaction: trx })

            if (!opts?.transaction) await trx.commit()
            return res;
        } catch (e: any) {
            if (!opts?.transaction) await trx.rollback()
            console.error(e.message)
            throw e
        }
    }

    /**
     * Create 1:1 (One to one) relational columns in the database\
     * 
     * Creates a column with name `${attribute.foreignKey}Id` in the `${attribute.ref}` table
     * which references current `tableName`'s `id` column
     * @param tableName Name of the table/entity
     * @param attribute Attribute to create relational columns for
     * @param opts (optional)
     */
    async addRelationalColumnsForOneToOne(tableName: string, attribute: Attribute, opts?: QueryInterfaceOptions) {
        if (attribute.isTarget) throw new Error(`Can't generate relations for an attribute which is on the target side of a relation : ${attribute.name}`)
        const trx: Transaction = opts?.transaction || await this.adapter.transaction()
        try {
            let res: any;

            // perform basic validations
            const { ref, foreignKey } = attribute || {}
            if (!ref || !foreignKey) throw new Error(`Invalid relational attribute : ${JSON.stringify(attribute)}`)

            // create new column in the ref table
            res = await this.addColumn(ref, {
                name: foreignKey + "Id",
                type: BaseAttributeType.relation,
                ref: tableName
            }, { transaction: trx })

            if (!opts?.transaction) await trx.commit()
            return res;
        } catch (e: any) {
            if (!opts?.transaction) await trx.rollback()
            console.error(e.message)
            throw e
        }
    }

    /**
     * Create 1:M (One to many) relational columns in the database\
     * 
     * Creates a column with name `${attribute.foreignKey}Id` in the `${attribute.ref}` table
     * which references current `tableName`'s `id` column
     * @param tableName Name of the table/entity
     * @param attribute Attribute to create relational columns for
     * @param opts (optional)
     */
    async addRelationalColumnsForOneToMany(tableName: string, attribute: Attribute, opts?: QueryInterfaceOptions) {
        if (attribute.isTarget) throw new Error(`Can't generate relations for an attribute which is on the target side of a relation : ${attribute.name}`)
        const trx: Transaction = opts?.transaction || await this.adapter.transaction()
        try {
            let res: any;

            // perform basic validations
            const { ref, foreignKey } = attribute || {}
            if (!ref || !foreignKey) throw new Error(`Invalid relational attribute : ${JSON.stringify(attribute)}`)

            // create new column in the ref table
            res = await this.addColumn(ref, {
                name: foreignKey + "Id",
                type: BaseAttributeType.relation,
                ref: tableName
            }, { transaction: trx })

            if (!opts?.transaction) await trx.commit()
            return res;
        } catch (e: any) {
            if (!opts?.transaction) await trx.rollback()
            console.error(e.message)
            throw e
        }
    }

    /**
     * Create M:1 (Many to one) relational columns in the database\
     * 
     * Its a noop as m:1 side serves as the target side of the relation and
     * the other side of the relation, i.e. 1:m, creates the relational columns in the db
     * @param tableName Name of the table/entity
     * @param attribute Attribute to create relational columns for
     * @param opts (optional)
     */
    async addRelationalColumnsForManyToOne(tableName: string, attribute: Attribute, opts?: QueryInterfaceOptions) {
        // Many to one relation type attribute should not create any relational columns
        // as the other side of the relation (i.e. One to many) will handle this
    }

    /**
     * Create M:N (Many to many) relational columns in the database
     * 
     * Creates a junction table with name `${attribute.name}_${attribute.foreignKey}`\
     * having columns
     * - `${tableName}Id` referencing `${attribute.ref}`'s `id` column and
     * - `${attribute.ref}Id` referencing `${tableName}`'s `id` column
     * @param tableName Name of the table/entity
     * @param attribute Attribute to create relational columns for
     * @param opts (optional)
     */
    async addRelationalColumnsForManyToMany(tableName: string, attribute: Attribute, opts?: QueryInterfaceOptions) {
        if (attribute.isTarget) throw new Error(`Can't generate relations for an attribute which is on the target side of a relation : ${attribute.name}`)
        const trx: Transaction = opts?.transaction || await this.adapter.transaction()
        try {
            let res: any;

            // perform basic validations
            const { ref, foreignKey, name } = attribute || {}
            if (!ref || !foreignKey || !name) throw new Error(`Invalid relational attribute : ${JSON.stringify(attribute)}`)

            const junctionTableName = tableName + "_" + name + "_" + foreignKey
            res = await this.qi.createTable(junctionTableName, {
                [ref + "Id"]: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: ref,
                        key: 'id'
                    },
                    unique: false,
                    allowNull: true
                },
                [tableName + (tableName === ref ? "_" : "") + "Id"]: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: tableName,
                        key: 'id'
                    },
                    unique: false,
                    allowNull: true
                },
                createdAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: new Date()
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: new Date()
                }
            }, { transaction: trx })

            if (!opts?.transaction) await trx.commit()
            return res;
        } catch (e: any) {
            if (!opts?.transaction) await trx.rollback()
            console.error(e.message)
            throw e
        }
    }

    /**
     * Remove [1] (Has one) relational columns in the database\
     * 
     * Removes a column with name `${attribute.foreignKey}Id` in the `${attribute.ref}` table
     * which references current `tableName`'s `id` column
     * @param tableName Name of the table/entity
     * @param attribute Attribute to remove relational columns for
     * @param opts (optional)
     */
    async removeRelationalColumnsForHasOne(tableName: string, attribute: Attribute, opts?: QueryInterfaceOptions) {

        const trx: Transaction = opts?.transaction || await this.adapter.transaction()
        try {
            let res: any;
            // perform basic validations
            const { ref, foreignKey } = attribute || {}
            if (!ref || !foreignKey) throw new Error(`Invalid relational attribute : ${JSON.stringify(attribute)}`)

            // create new column in the ref table
            res = await this.removeColumn(ref, foreignKey + "Id", { transaction: trx })

            if (!opts?.transaction) await trx.commit()
            return res;
        } catch (e: any) {
            if (!opts?.transaction) await trx.rollback()
            console.error(e.message)
            throw e
        }
    }

    /**
     * Remove [M] (Has many) relational columns in the database\
     * 
     * Removes a column with name `${attribute.foreignKey}Id` in the `${attribute.ref}` table
     * which references current `tableName`'s `id` column
     * @param tableName Name of the table/entity
     * @param attribute Attribute to remove relational columns for
     * @param opts (optional)
     */
    async removeRelationalColumnsForHasMany(tableName: string, attribute: Attribute, opts?: QueryInterfaceOptions) {
        const trx: Transaction = opts?.transaction || await this.adapter.transaction()
        try {
            let res: any;

            // perform basic validations
            const { ref, foreignKey } = attribute || {}
            if (!ref || !foreignKey) throw new Error(`Invalid relational attribute : ${JSON.stringify(attribute)}`)

            // remove new column in the ref table
            res = await this.removeColumn(ref, foreignKey + "Id", { transaction: trx })

            if (!opts?.transaction) await trx.commit()
            return res;
        } catch (e: any) {
            if (!opts?.transaction) await trx.rollback()
            console.error(e.message)
            throw e
        }
    }

    /**
     * Remove 1:1 (One to one) relational columns in the database\
     * 
     * Removes a column with name `${attribute.foreignKey}Id` in the `${attribute.ref}` table
     * which references current `tableName`'s `id` column
     * @param tableName Name of the table/entity
     * @param attribute Attribute to remove relational columns for
     * @param opts (optional)
     */
    async removeRelationalColumnsForOneToOne(tableName: string, attribute: Attribute, opts?: QueryInterfaceOptions) {
        const trx: Transaction = opts?.transaction || await this.adapter.transaction()
        try {
            let res: any;

            // perform basic validations
            const { ref, foreignKey, name } = attribute || {}
            if (!ref || !foreignKey || !name) throw new Error(`Invalid relational attribute : ${JSON.stringify(attribute)}`)

            // figure out the side of the relation based on isTarget
            const table = attribute.isTarget ? tableName : ref
            const key = attribute.isTarget ? name : foreignKey

            // remove new column in the ref table
            res = await this.removeColumn(table, key + "Id", { transaction: trx })

            if (!opts?.transaction) await trx.commit()
            return res;
        } catch (e: any) {
            if (!opts?.transaction) await trx.rollback()
            console.error(e.message)
            throw e
        }
    }

    /**
     * Remove 1:M (One to many) relational columns in the database\
     * 
     * Removes a column with name `${attribute.foreignKey}Id` in the `${attribute.ref}` table
     * which references current `tableName`'s `id` column
     * @param tableName Name of the table/entity
     * @param attribute Attribute to remove relational columns for
     * @param opts (optional)
     */
    async removeRelationalColumnsForOneToMany(tableName: string, attribute: Attribute, opts?: QueryInterfaceOptions) {
        const trx: Transaction = opts?.transaction || await this.adapter.transaction()
        try {
            let res: any;

            // perform basic validations
            const { ref, foreignKey } = attribute || {}
            if (!ref || !foreignKey) throw new Error(`Invalid relational attribute : ${JSON.stringify(attribute)}`)

            // remove new column in the ref table
            res = await this.removeColumn(ref, foreignKey + "Id", { transaction: trx })
            if (!opts?.transaction) await trx.commit()
            return res;
        } catch (e: any) {
            if (!opts?.transaction) await trx.rollback()
            console.error(e.message)
            throw e
        }
    }

    /**
     * Remove M:1 (Many to one) relational columns in the database\
     * 
     * Removes a column with name `${attribute.name}Id` in the `${tableName}` table
     * which references `${attribute.ref}` table's `id` column
     * @param tableName Name of the table/entity
     * @param attribute Attribute to remove relational columns for
     * @param opts (optional)
     */
    async removeRelationalColumnsForManyToOne(tableName: string, attribute: Attribute, opts?: QueryInterfaceOptions) {
        const trx: Transaction = opts?.transaction || await this.adapter.transaction()
        try {
            let res: any;

            // perform basic validations
            const { ref, foreignKey, name } = attribute || {}
            if (!ref || !foreignKey || !name) throw new Error(`Invalid relational attribute : ${JSON.stringify(attribute)}`)

            // remove new column in the current table table
            res = await this.removeColumn(tableName, name + "Id", { transaction: trx })
            if (!opts?.transaction) await trx.commit()
            return res;
        } catch (e: any) {
            if (!opts?.transaction) await trx.rollback()
            console.error(e.message)
            throw e
        }
    }

    /**
     * Remove M:N (Many to many) relational columns in the database
     * 
     * Removes a junction table with name `${attribute.name}_${attribute.foreignKey}`\
     * having columns
     * - `${tableName}Id` referencing `${attribute.ref}`'s `id` column and
     * - `${attribute.ref}Id` referencing `${tableName}`'s `id` column
     * @param tableName Name of the table/entity
     * @param attribute Attribute to remove relational columns for
     * @param opts (optional)
     */
    async removeRelationalColumnsForManyToMany(tableName: string, attribute: Attribute, opts?: QueryInterfaceOptions) {
        const trx: Transaction = opts?.transaction || await this.adapter.transaction()
        try {
            let res: any;

            // perform basic validations
            const { ref, foreignKey, name } = attribute || {}
            if (!ref || !foreignKey || !name) throw new Error(`Invalid relational attribute : ${JSON.stringify(attribute)}`)

            // figure out the side of the relation based on isTarget
            const table = attribute.isTarget ? ref : tableName
            const nm = attribute.isTarget ? foreignKey : name
            const key = attribute.isTarget ? name : foreignKey

            const junctionTableName = table + "_" + nm + "_" + key
            res = await this.dropTable(junctionTableName)

            if (!opts?.transaction) await trx.commit()
            return res;
        } catch (e: any) {
            if (!opts?.transaction) await trx.rollback()
            console.error(e.message)
            throw e
        }
    }

    /**
     * Create relational columns in the database
     * @param attribute Attribute to create relational columns for
     * @param opts (optional)
     */
    async addRelationalColumn(tableName: string, attribute: Attribute, opts?: QueryInterfaceOptions) {
        if (attribute.isTarget) {
            console.warn(`Can't add relational columns for an attribute which is on the target side of the relation : ${attribute.name}`)
            return;
        };
        const trx: Transaction = opts?.transaction || await this.adapter.transaction()
        try {
            let res;
            // switch on attribute relation type and process accordingly
            switch (attribute.relationType) {
                case RelationType.HAS_ONE:
                    res = await this.addRelationalColumnsForHasOne(tableName, attribute, { transaction: trx })
                    break;
                case RelationType.HAS_MANY:
                    res = await this.addRelationalColumnsForHasMany(tableName, attribute, { transaction: trx })
                    break;
                case RelationType.ONE_TO_ONE:
                    res = await this.addRelationalColumnsForOneToOne(tableName, attribute, { transaction: trx })
                    break;
                case RelationType.ONE_TO_MANY:
                    res = await this.addRelationalColumnsForOneToMany(tableName, attribute, { transaction: trx })
                    break;
                case RelationType.MANY_TO_ONE:
                    res = await this.addRelationalColumnsForManyToOne(tableName, attribute, { transaction: trx })
                    break;
                case RelationType.MANY_TO_MANY:
                    res = await this.addRelationalColumnsForManyToMany(tableName, attribute, { transaction: trx })
                    break;
                default:
                    console.debug("Attribute is not a relation type attribute", attribute.name)
                    throw new Error(`Attribute is not a relation type attribute : ${attribute.name}`)
            }
            if (!opts?.transaction) await trx.commit()
            return res
        }
        catch (e: any) {
            if (!opts?.transaction) await trx.rollback()
            console.error(e.message)
            throw e
        }
    }

    /**
     * Migrate/Change an existing relational column in the database
     * (along with changing the relational columns in the ref table)
     * @param schema Entity schema
     * @param oldAttribute Old unmodified attribute
     * @param newAttribute New changed attribute
     * @param opts (optional)
     * @returns 
     */
    async changeRelationalColumn(schema: EntitySchema, oldAttribute: Attribute, newAttribute: Attribute, opts?: QueryInterfaceOptions) {
        const trx = opts?.transaction || await this.ds.transaction()
        try {

            let res;
            const tableName = schema.name

            // if oldAttribute exists
            // remove the relational columns for the old attribute
            if (oldAttribute?.name) {
                switch (oldAttribute.relationType) {
                    case RelationType.HAS_ONE:
                        res = await this.removeRelationalColumnsForHasOne(tableName, oldAttribute, { transaction: trx })
                        break;
                    case RelationType.HAS_MANY:
                        res = await this.removeRelationalColumnsForHasMany(tableName, oldAttribute, { transaction: trx })
                        break;
                    case RelationType.ONE_TO_ONE:
                        res = await this.removeRelationalColumnsForOneToOne(tableName, oldAttribute, { transaction: trx })
                        break;
                    case RelationType.ONE_TO_MANY:
                        res = await this.removeRelationalColumnsForOneToMany(tableName, oldAttribute, { transaction: trx })
                        break;
                    case RelationType.MANY_TO_ONE:
                        res = await this.removeRelationalColumnsForManyToOne(tableName, oldAttribute, { transaction: trx })
                        break;
                    case RelationType.MANY_TO_MANY:
                        res = await this.removeRelationalColumnsForManyToMany(tableName, oldAttribute, { transaction: trx })
                        break;
                    default:
                        console.debug("Attribute is not a relation type attribute", oldAttribute.name)
                        throw new Error(`Attribute is not a relation type attribute : ${oldAttribute.name}`)
                }
            }

            // if new attribute is target type, skip creating relations
            if (newAttribute.isTarget) {
                console.warn(`Can't add relational columns for an attribute which is on the target side of the relation : ${newAttribute.name}`)
            } else {
                // for newAttribute
                // add new relational columns for newAttribute
                // switch on attribute relation type and process accordingly
                switch (newAttribute.relationType) {
                    case RelationType.HAS_ONE:
                        res = await this.addRelationalColumnsForHasOne(tableName, newAttribute, { transaction: trx })
                        break;
                    case RelationType.HAS_MANY:
                        res = await this.addRelationalColumnsForHasMany(tableName, newAttribute, { transaction: trx })
                        break;
                    case RelationType.ONE_TO_ONE:
                        res = await this.addRelationalColumnsForOneToOne(tableName, newAttribute, { transaction: trx })
                        break;
                    case RelationType.ONE_TO_MANY:
                        res = await this.addRelationalColumnsForOneToMany(tableName, newAttribute, { transaction: trx })
                        break;
                    case RelationType.MANY_TO_ONE:
                        res = await this.addRelationalColumnsForManyToOne(tableName, newAttribute, { transaction: trx })
                        break;
                    case RelationType.MANY_TO_MANY:
                        res = await this.addRelationalColumnsForManyToMany(tableName, newAttribute, { transaction: trx })
                        break;
                    default:
                        console.debug("Attribute is not a relation type attribute", newAttribute.name)
                        throw new Error(`Attribute is not a relation type attribute : ${newAttribute.name}`)
                }
            }
            if (!opts?.transaction) await trx.commit()
            return res
        } catch (e: any) {
            if (!opts?.transaction) await trx.rollback()
            console.error(e.message)
            throw e
        }
    }

    /**
     * Remove an existing relational column in the database
     * (along with changing the relational columns in the ref table)
     * @param schema Entity schema
     * @param oldAttribute Old unmodified attribute
     * @param newAttribute New changed attribute
     * @param opts (optional)
     * @returns 
     */
    async removeRelationalColumn(schema: EntitySchema, oldAttribute: Attribute, opts?: QueryInterfaceOptions) {
        const trx = opts?.transaction || await this.ds.transaction()
        try {

            let res;
            const tableName = schema.name
            // if oldAttribute exists
            // remove the relational columns for the old attribute
            if (oldAttribute?.name) {
                switch (oldAttribute.relationType) {
                    case RelationType.HAS_ONE:
                        res = await this.removeRelationalColumnsForHasOne(tableName, oldAttribute, { transaction: trx })
                        break;
                    case RelationType.HAS_MANY:
                        res = await this.removeRelationalColumnsForHasMany(tableName, oldAttribute, { transaction: trx })
                        break;
                    case RelationType.ONE_TO_ONE:
                        res = await this.removeRelationalColumnsForOneToOne(tableName, oldAttribute, { transaction: trx })
                        break;
                    case RelationType.ONE_TO_MANY:
                        res = await this.removeRelationalColumnsForOneToMany(tableName, oldAttribute, { transaction: trx })
                        break;
                    case RelationType.MANY_TO_ONE:
                        res = await this.removeRelationalColumnsForManyToOne(tableName, oldAttribute, { transaction: trx })
                        break;
                    case RelationType.MANY_TO_MANY:
                        res = await this.removeRelationalColumnsForManyToMany(tableName, oldAttribute, { transaction: trx })
                        break;
                    default:
                        console.debug("Attribute is not a relation type attribute", oldAttribute.name)
                        throw new Error(`Attribute is not a relation type attribute : ${oldAttribute.name}`)
                }
            }
            if (!opts?.transaction) await trx.commit()
            return res
        } catch (e: any) {
            if (!opts?.transaction) await trx.rollback()
            console.error(e.message)
            throw e
        }
    }


    /**
     * Add new attribute to the db (along with relations if any)
     * @param schema Entity schema to use
     * @param attribute Attribute to add
     * @param opts (optional)
     * @returns 
     */
    async addAttribute(schema: EntitySchema, attribute: Attribute, opts?: AddAttributeOpts) {
        const trx = opts?.transaction || await this.ds.transaction()
        let res: any;
        try {
            if (attribute.type === BaseAttributeType.relation) {
                // handle relation type attributes separatly
                res = await this.addRelationalColumn(schema.name, attribute, { transaction: trx })
            } else {
                // add the attribute column to the databse
                res = await this.addColumn(schema.name, attribute, { transaction: trx })
            }

            if (!opts?.transaction) await trx.commit()
            return res
        } catch (e: any) {
            if (!opts?.transaction) await trx.rollback()
            console.error(e.message)
            throw e
        }
    }

    /**
     * Migrate any new changes to existing attribute in the database
     * @param schema Schema to use
     * @param oldAttribute Old attribute (unmodified)
     * @param newAttribute New modified attribute
     * @param opts (optional)
     */
    async changeAttribute(schema: EntitySchema, oldAttribute: Attribute, newAttribute: Attribute, opts?: QueryInterfaceOptions) {
        const trx = opts?.transaction || await this.ds.transaction()
        let res: any;
        try {
            // if new attr type is relation
            if (newAttribute.type === BaseAttributeType.relation) {
                // process accordingly
                await this.changeRelationalColumn(schema, oldAttribute, newAttribute, { transaction: trx })
            } else {
                // change non relational column
                await this.changeColumn(schema, oldAttribute, newAttribute, { transaction: trx })
            }

            if (!opts?.transaction) await trx.commit()
            return res
        } catch (e: any) {
            if (!opts?.transaction) await trx.rollback()
            console.error(e.message)
            throw e
        }

    }

    /**
     * Remove existing attribute (along with relational references if any)
     * @param schema Schema to use
     * @param attribute Attribute to remove
     * @param opts (optionals)
     */
    async removeAttribute(schema: EntitySchema, attribute: Attribute, opts?: QueryInterfaceOptions) {
        const trx = opts?.transaction || await this.ds.transaction()
        let res: any;
        try {

            if (attribute.type === BaseAttributeType.relation) {
                // remove relational columns associated with this attribute
                res = await this.removeRelationalColumn(schema, attribute, { transaction: trx })
            } else {
                // remove as non relational column from `${schema.name}` named table
                res = await this.removeColumn(schema.name, attribute.name, { transaction: trx })
            }

            if (!opts?.transaction) await trx.commit()
            return res
        } catch (e: any) {
            if (!opts?.transaction) await trx.rollback()
            console.error(e.message)
            throw e
        }
    }

    /**
     * Prepare db column for sequelize model
     * @param attribute 
     * @returns 
     */
    public prepareColumn = (attribute: Attribute) => {

        const validate: any = {}
        for (let v of attribute?.validations || []) {
            validate[v.type] = v.value
        }
        if (attribute.values) {
            validate[BasicAttributeValidation.isIn] = [[
                ...(validate[BasicAttributeValidation.isIn] || []),
                ...(attribute.values || [])
            ]]
        }

        const col = {
            type: attribute?.type === BaseAttributeType.relation ? TypeMap[BaseAttributeType.number] : (attribute?.subType ? SubTypeMap[attribute.subType] : TypeMap[attribute.type]),
            validate,
            allowNull: !attribute.isRequired ?? true,
            defaultValue: attribute.isRequired ? (DefaultValueMap[attribute.subType || attribute.type] ?? DefaultValueMap[attribute.type]) : (attribute.defaultValue ?? null),
            values: attribute.values,
            references: attribute?.type === BaseAttributeType.relation ? {
                model: attribute.ref,
                key: 'id'
            } : undefined
        }
        return col
    }


    /**
     * Returns the sequelize query interface
     */
    get qi() {
        return this.adapter.dataSource.getQueryInterface()
    }

    /**
     * Returns initialized sequelize datasource
     */
    get ds() {
        return this.adapter.dataSource
    }

}