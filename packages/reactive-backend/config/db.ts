export default {
    adapter: process.env.RX_SERVER_DB_ADAPTER || "typeorm",
    options: {
        type: process.env.RX_SERVER_DB_TYPE || "sqlite",
        database: process.env.RX_SERVER_DB_DATABASE || "rx-server.sql",
    }
}