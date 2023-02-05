export default {
    host: process.env.RX_SERVER_HOST || "0.0.0.0",
    port: parseInt(process.env.RX_SERVER_PORT) || 1338,
    cors: {
        origin: process.env.RX_SERVER_CORS_ORIGIN || "*"
    }
}