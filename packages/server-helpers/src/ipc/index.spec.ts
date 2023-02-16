import { IPCClient, IPCServer, IPC_COMMAND } from "./index"

describe('IPC Server', () => {
    let called = 0
    const server = new IPCServer({
        "RESTART_SERVER": () => {
            console.log("called")
            called += 1
        }
    })
    const client = new IPCClient()


    beforeAll(async () => {
        await server.init()
        await server.start()
        await new Promise(res => setTimeout(res, 100))
        await client.init()
        await new Promise(res => setTimeout(res, 100))
    })
    it("should start the server", async () => {
        expect(true)
    })

    it("it should initalize and send a message as a client", async () => {

        client.send(IPC_COMMAND.RESTART_SERVER)
        await new Promise(res => setTimeout(res, 100))
        expect(called).toBe(1)
    })

})