// build the admin if not built (look for cache folder) -> .cache/admin
// build project using tsc in watch mode -> .cache/app
// load the entry point from .cache/app and reload on every file change event

import { ChildProcess, exec, fork, spawn } from "child_process"
import { IPCServer } from "@reactive/server-helpers"
// import ipc from "node-ipc"

let appProcess: ChildProcess;
const pwd = process.cwd()

const init = async () => {
    const ipcServer = new IPCServer({
        RESTART_SERVER: () => {
            if (appProcess?.pid > -1) {
                appProcess.kill()
                appProcess = startApp(pwd)
            }
        }
    })

    await ipcServer.init()
    ipcServer.start()
}


export const dev = async () => {
    appProcess = startApp(pwd)
}


const startApp = (pwd: string) => {
    return spawn(`npx ts-node-dev`, ["--respawn", "--exit-child",`--watch .rid`, `${pwd}/main.ts`], {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
        shell: true
    })
}