export default {
    v: "0.0.1",
    relativePaths: ["plugins", "../plugins"],
    plugins: [
        {
            name: "@reactive/server-dashboard",
        },
        {
            name: "@reactive/plugin-data-explorer",
        },
        {
            name: "@reactive/plugin-data-types",
        },
        {
            name: "@reactive/plugin-auth",
            options: {
                hashRounds: 10,
                jsonSecret: "abrakadabra"
            }
        },
        {
            name: "@reactive/plugin-media",
        },
    ]
}