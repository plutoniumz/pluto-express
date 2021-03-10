module.exports = async function (req, res, proceed) {
    const account = await Account.getOne(req.session.employee_id)
    if (account.is_admin) {
        return proceed()
    }

    const companies = await Account.getPermission(req.session.employee_id)

    const appName = req.path.split('/')[1]

    /*if (isSuperAdmin(companies) || (await evaluate(companies, appName, req))) {
        return proceed()
    }*/

    return res.forbidden('Không có quyền truy cập')
}
