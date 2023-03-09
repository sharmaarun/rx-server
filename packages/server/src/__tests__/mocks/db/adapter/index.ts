import { EntitySchema } from "@reactive/commons";
import { DBAdapter, DropDatabaseOptions, Entity, EntityHook, EntityHookFn, EntityHookFns, QueryInterface, SyncDatabaseOptions } from "../../../../"

export default class MockDBAdapter extends DBAdapter {
    public addHook<H extends keyof EntityHookFns<any, any> = any>(trigger: H extends H ? keyof EntityHookFns<any, any> : H, name: string, fn: EntityHookFn<H, any>): void {
    }
    public removeHook<H extends keyof EntityHookFns<any, any> = any>(trigger: H extends H ? keyof EntityHookFns<any, any> : H, name: string): void {
    }
    public hookExists<H extends keyof EntityHookFns<any, any> = any>(trigger: H extends H ? keyof EntityHookFns<any, any> : H, name: string): EntityHook {
        return {} as EntityHook
    }

    public models: Entity[] = []
    connect(): void | Promise<void> {
        return;
    }
    disconnect(): void | Promise<void> {
        return;
    }
    model<T = any>(schema: EntitySchema<any>): Entity<T> | Promise<Entity<T>> {
        const e: Entity = {} as any
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
            ) { },
            createEntity(schema, opts) {

            },
            removeEntity(schema, opts) {

            },
        }
    }
    async transaction() {
        return {
            async commit() { },
            async afterCommit() { },
            async rollback() { },
            LOCK: null
        };
    }

    defineRelations<T = any>(entity: Entity<any>, entities: Entity<any>[]): void | Promise<void> {

    }

}