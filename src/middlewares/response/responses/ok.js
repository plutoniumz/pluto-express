module.exports = function (data, total = 1) {
    if (Array.isArray(data)) {
        this.set('X-Total-Count', total)
    }

    return this.send({
        data: data,
        total: total,
    })
}
