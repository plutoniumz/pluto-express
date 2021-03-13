module.exports = async function (req, res, proceed) {
    const employee = session.getEmployee(req)

    if (employee.is_admin) {
        return proceed()
    } else if (req.company_id) {
        const appName = req.path.split('/')[1]
        const appId = await App.getId(appName)

        const permission = await Permission.getOne(
            appId,
            employee.id,
            req.company_id,
        )

        const modeId = await Mode.getIdByHttpMethod(req.method)

        // https://youtu.be/pIrOAyXIjak?t=28
        if (permission.id >= modeId) {
            return proceed()
        } else {
            return res.forbidden('Không có quyền truy cập')
        }
    }
}
