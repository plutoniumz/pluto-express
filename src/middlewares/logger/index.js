class LoggerMiddleware {
    init() {
        app.use((req, res, next) => {
            res.on('finish', function () {
                console.log(
                    req.header('Origin'),
                    req.method,
                    req.url,
                    req.body,
                    res.statusCode,
                )
            })
            next()
        })
    }
}

module.exports = new LoggerMiddleware()
