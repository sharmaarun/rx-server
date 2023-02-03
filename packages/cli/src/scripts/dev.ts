// build the admin if not built (look for cache folder) -> .cache/admin
// build project using tsc in watch mode -> .cache/app
// load the entry point from .cache/app and reload on every file change event

import { exec, spawn } from "child_process"

export const dev = () => {
    const pwd = process.cwd()
    const devProcess = exec(`ts-node-dev ${pwd}/main.ts`)
    devProcess.stdout.pipe(process.stdout)
    devProcess.stderr.pipe(process.stderr)
}