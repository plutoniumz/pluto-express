module.exports = function (message) {
    return this.status(200).send({
        id: session.hasEmployee(this) ? session.getEmployee(this).id : 0,
        message: message,
    })
}
