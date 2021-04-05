const mime = require('mime-types')
const AVATAR_FILES_PATH = 'files/avatars'

module.exports = {
    login: async function (req, res) {
        if (!req.body.username || !req.body.password)
            return res.forbidden('Missing "username" or "password"')

        const employee = await Employee.getOneWithPasswordByUsername(
            req.body.username,
        )

        if (!employee) return res.forbidden('Employee not found')

        const isSamePassword = Employee.checkPassword(
            req.body.password,
            employee.password,
        )

        if (!isSamePassword) return res.unauthorized('Invalid account')

        session.setEmployee(req, employee)

        return res.ok(session.getEmployee(req))
    },

    logout: async function (req, res) {
        session.deleteEmployee(req)

        return res.sendMessage('Logout succeed')
    },

    changePassword: async function (req, res) {
        const employeeId = session.getEmployee(req).id

        const employee = await Employee.getOneWithPasswordById(employeeId)

        const isSamePassword = Employee.checkPassword(
            req.body.old_password,
            employee.password,
        )

        if (!isSamePassword)
            return res.unauthorized('Mật khẩu cũ không trùng khớp')

        await Employee.updateOneById(
            {
                password: Employee.hashPassword(req.body.new_password),
            },
            employeeId,
        )

        return res.sendMessage('Đổi mật khẩu thành công')
    },

    changeAvatar: async function (req, res) {
        const { mimetype, data } = req.files.avatar
        const fileName = `avatar${Date.now()}.${mime.extension(mimetype)}`
        const employee = await Employee.findOne({
            where: {
                id: session.getEmployee(req).id,
            },
        })

        const oldAvatarPath = `${process.cwd()}/${employee.avatar}`
        if (fs.existsSync(oldAvatarPath)) {
            fs.unlinkSync(oldAvatarPath)
        }

        await Employee.update(
            {
                avatar: `${AVATAR_FILES_PATH}/${fileName}`,
            },
            {
                where: {
                    id: session.getEmployee(req).id,
                },
            },
        )

        fs.writeFileSync(
            `${process.cwd()}/${AVATAR_FILES_PATH}/${fileName}`,
            data,
        )

        res.ok({
            message: 'Change avatar succeed',
            avatar: `${AVATAR_FILES_PATH}/${fileName}`,
        })
    },

    getPermission: async function (req, res) {
        const employeeId = session.getEmployee(req).id

        const permission = await Employee.getPermission(employeeId)

        return res.ok(permission)
    },

    getAllPermissions: async function (req, res) {
        const allCompanies = await Company.getAll()
        const allApps = await App.getAll()

        allApps.forEach(app => (app.mode = null))

        allCompanies.forEach(company => {
            company.apps = allApps
            company.access = false
        })

        res.send(allCompanies)
    },
}
