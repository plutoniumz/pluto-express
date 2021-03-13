module.exports = function (message) {
    return this.status(200).send({
        data: {
            id: session.hasEmployee(this) ? session.getEmployee(this).id : 0,
            message: message,
        },
    })
}
