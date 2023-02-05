#!/usr/bin/env node
import { Command } from "commander"
import "reflect-metadata"
import { version } from "../../package.json"
import { buildAdmin, dev } from "../scripts"



const program = new Command()

const build = (args: any) => {
    const { watch, prod } = program.opts()
    if(prod) console.info("| Production Mode |")
    buildAdmin({
        watch,
        mode: prod ? "production" : "development"
    })
}

const dev_ = (args: any) => {
    const { watch } = program.opts()

    if (watch) {
        buildAdmin({
            watch
        })
    }
    dev()
}

program.version(version)

program.command("build")
    .description("Build admin panel")
    .action(build)

program.command("dev")
    .description("Start the  server in development mode. (builds admin panel in watch mode with -w flag)")
    .action(dev_)

program.option("-p --prod", "Run in production mode")
program.option("-w --watch", "Run in watch mode")

program.parse(process.argv)




// if (options.build) {
//     buildAdmin({})
// }

// if (options.dev) {
//     console.log(textSync("REACTIVE SRV"))
//     console.log("dev")
// }