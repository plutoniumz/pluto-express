module.exports = function (message) {
    return this.status(200).send({
        id: app.request.session ? app.request.session.employee.id : 0,
        message: message,
    })
}
