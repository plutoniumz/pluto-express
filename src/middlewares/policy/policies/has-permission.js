module.exports = async function (req, res, proceed) {
    const employee = session.getEmployee(req)

    if (employee.is_admin) {
        return proceed()
    }

    return res.forbidden('Không có quyền truy cập')
}
