module.exports = function (message) {
    return this.status(401).send({ message: message })
}
