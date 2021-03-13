module.exports = function (message) {
    return this.status(200).send({
        message: message,
    })
}
