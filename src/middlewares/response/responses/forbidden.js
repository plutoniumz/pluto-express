module.exports = function (message) {
    return this.status(403).send({
        message: message,
    })
}
