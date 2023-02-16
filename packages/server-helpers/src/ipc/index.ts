import ipc from "node-ipc"

export const IPC_SERVER_ID = "RX_IPC_SERVER"

// COMMANDS
export const enum IPC_COMMAND {
    RESTART_SERVER = "RESTART_SERVER"
}

export type RegisteredCommands = {
    [key in IPC_COMMAND]: () => void
}

export class IPCServer {
    constructor(
        private registeredCommands: RegisteredCommands
    ) {
        ipc.config.id = IPC_SERVER_ID
    }

    async init() {
        ipc.serve(() => {
            console.debug("Started ipc server")
        })

        ipc.server.on("MESSAGE", (message: IPC_COMMAND) => {
            this.registeredCommands[message]?.()
        })
    }


    async start() {
        ipc.server.start()
    }
}

export class IPCClient {
    constructor(
        private server?: any
    ) {

    }

    async init() {
        return new Promise(res => {
            ipc.connectTo(IPC_SERVER_ID, () => {
                this.server = ipc.of[IPC_SERVER_ID];
                this.server?.on("connect", () => {
                    res(true)
                })
            })
        }
        )
    }

    send(message: IPC_COMMAND) {
        this.server?.emit("MESSAGE", message)
    }

    async start() {

    }
}