import { EntitySchema } from "@reactive/commons";
import { DBAdapter, DropDatabaseOptions, Entity, QueryInterface, SyncDatabaseOptions } from "../../../../"

export default class MockDBAdapter extends DBAdapter {

    public models: Entity[] = []
    connect(): void | Promise<void> {
        return;
    }
    disconnect(): void | Promise<void> {
        return;
    }
    model<T = any>(schema: EntitySchema<any>): Entity<T> | Promise<Entity<T>> {
        const e = new Entity()
        e.schema = schema
        this.models.push(e)
        return e
    }
    dropDatabase(opts?: DropDatabaseOptions | undefined): void | Promise<void> {
        return;
    }
    sync(opts?: SyncDatabaseOptions | undefined): void | Promise<void> {
        return;
    }
    getQueryInterface(): QueryInterface {
        return {
            addAttribute(
                schema,
                attribute) { },
            changeAttribute(
                schema,
                oldAttribute,
                newAttribute,
            ) { },
            removeAttribute(
                allSchemas,
                attribute
            ) { }
        }
    }
    async transaction({ }: any) {
        return {} as any;
    }

    defineRelations<T = any>(entity: Entity<any>, entities: Entity<any>[]): void | Promise<void> {

    }

}