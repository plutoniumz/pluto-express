module.exports = async function (req, res, proceed) {
    return session.hasEmployee(req)
        ? proceed()
        : res.forbidden('Vui lòng đăng nhập')
}
