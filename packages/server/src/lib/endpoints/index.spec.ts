import { APIRoute, BaseValidationError, Endpoint } from "@reactive/commons";
import { EndpointManager } from "."
import { ExpressManager } from "../express"
import { Logger } from "../logger";

describe('Endpoints Manager', () => {
    const epMgr = new EndpointManager(new ExpressManager())
    const logger = new Logger()
    let middlewareCalled = false;

    const res = { header: () => { }, send: () => { } }

    beforeAll(async () => {
        await logger.init()
        await epMgr.init({
            appDir: __dirname,
            config: {
                api: {
                    path: ".",
                    webRoot: "api"
                }
            },
            logger
        } as any
        )
    })

    it("should create router with default routes attached", () => {
        const router = epMgr.createRouter("test", ctx => ([]))
        expect(router.find(r => r.handler === "list")).toBeTruthy()
        expect(router.find(r => r.handler === "read")).toBeTruthy()
        expect(router.find(r => r.handler === "create")).toBeTruthy()
        expect(router.find(r => r.handler === "update")).toBeTruthy()
        expect(router.find(r => r.handler === "delete")).toBeTruthy()
    })

    it("should create controller with default routes attached", () => {
        const controller = epMgr.createController("test", ctx => ({}))
        const keys = Object.keys(controller)
        expect(keys.includes("list")).toBeTruthy()
        expect(keys.includes("read")).toBeTruthy()
        expect(keys.includes("create")).toBeTruthy()
        expect(keys.includes("update")).toBeTruthy()
        expect(keys.includes("delete")).toBeTruthy()
    })

    it("should add middleware", async () => {
        const endpoint: Endpoint = {
            name: "test",
            controllers: {
                async list(ctx) {

                }
            },
            routes: [{
                method: "get",
                path: "/",
                handler: "list"
            }],
            schema: {
                name: "test"
            },
        }

        const route: APIRoute = {
            method: "get",
            path: "/",
            handler: "list"
        }

        epMgr.addRequestMiddleware({
            endpointName: "test",
            route,
            handler: (ctx) => {
                middlewareCalled = true
            }
        })


        const reqHandler = epMgr.prepareRequestHandler("/", endpoint, route)
        await reqHandler({} as any, res as any)
        expect(middlewareCalled).toBeTruthy()
    })

    it("should throw validation error", () => {
        try {
            throw new BaseValidationError("test", [], { ok: true })
        } catch (e) {
            console.log(e)
        }
    })

    it("should log the endpoint request in proper format", () => {
        epMgr.logEndpointRequest("delete","/asd/:id","list")
    })
})