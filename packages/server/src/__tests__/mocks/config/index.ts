import { Config } from "@reactive/commons";
export const dummyConfig: Config = {
    api: {
        path: "",
        webRoot: ""
    },
    db: {
        adapter: __dirname + "/../db/adapter/index",
        options: {

        }
    },
    plugins: {
        relativePaths: [],
        plugins: [
        ]
    },
    server: {
        cors: {
            origin: "*"
        },
        host: "0.0.0.0",
        port: 1338
    }
}