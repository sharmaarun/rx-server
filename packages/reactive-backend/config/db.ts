export default {
    adapter: process.env.RX_SERVER_DB_ADAPTER || "sequelize",
    options: {
        type: process.env.RX_SERVER_DB_TYPE || "sqlite",
        database: process.env.RX_SERVER_DB_DATABASE || "rxdb.db",
        logging: process.env.RX_SERVER_DB_LOGGIN || false
    }
}