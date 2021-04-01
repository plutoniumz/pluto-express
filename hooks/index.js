/* HOW TO USE
 *
 * LOADING ORDER: Changing exports order for reordering middleware loading order
 *
 * BUILT-IN MIDDLEWARES: Exports [MiddlewareName]: [MiddlewareConfig] (if config available)
 * CUSTOM MIDDLEWARES: Exports [MiddlewareName]: [MiddlewareModule]
 *
 * */

/* BUILT-IN MIDDLEWARES
 *
 * cors
 * helmet (config not available)
 * session
 * body-parser (config not available)
 * responses
 * policies
 * routes
 * sequelize
 * logger (config not available)
 *
 * */

/* CUSTOM MIDDLEWARES
 *
 * requests
 *
 * */

module.exports = {
    cors: require('./cors'),
    session: require('./session'),
    requests: require('./requests'),
    policies: require('./policies'),
    routes: require('./routes'),
    sequelize: require('./sequelize'),
}
