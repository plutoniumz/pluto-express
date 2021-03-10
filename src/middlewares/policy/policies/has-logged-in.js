module.exports = async function (req, res, proceed) {
    if (req.session.employee_id) {
        return proceed()
    }

    return res.forbidden('Vui lòng đăng nhập')
}
