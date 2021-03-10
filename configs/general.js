module.exports = {
    port: process.env.PORT || 1337,
    middlewares: [
        'cors',
        'helmet',
        'session',
        'body-parser',
        'request',
        'response',
        'policy',
        'route',
        'sequelize',
        'logger',
    ],
}
