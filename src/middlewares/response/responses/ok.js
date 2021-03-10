module.exports = function (data) {
    if (Array.isArray(data)) {
        this.set('X-Total-Count', data.length)
    }

    return this.send(data)
}
