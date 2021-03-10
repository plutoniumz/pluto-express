const bcrypt = require('bcryptjs')

module.exports = {
    login: async function (req, res) {
        const { username, password } = req.body
        const employee = await Account.findOne({
            attributes: {
                include: ['password'],
            },
            where: {
                username: username,
                is_active: 1,
            },
        })

        if (!employee && !(await bcrypt.compare(password, employee.password))) {
            return res.unauthorized('Tài khoản không hợp lệ')
        }

        req.session.employee_id = employee.id

        return res.sendMessage('Đăng nhập thành công')
    },

    logout: async function (req, res) {
        if (req.session) req.session.destroy()

        return res.sendMessage('Đăng xuất thành công')
    },

    changePassword: async function (req, res) {
        const { old_password, new_password } = req.body

        const employee = await Account.findOne({ id: req.session.employee.id })

        if (!(await bcrypt.compare(old_password, employee.password))) {
            // Avoid logout if wrong old password
            return res.unauthorized('Mật khẩu cũ không trùng khớp')
        }

        await Account.updateOne({
            id: req.session.employee.id,
        }).set({
            password: await bcrypt.hash(new_password, 10),
        })

        return res.sendMessage('Đổi mật khẩu thành công')
    },

    getPermission: async function (req, res) {
        const permission = await Account.getPermission(req.session.employee_id)

        return res.ok(permission)
    },

    getAllPermissions: async function (req, res) {
        const companies = await Company.findAll({
            raw: true,
            attributes: ['id', 'name'],
        })
        const apps = await App.findAll({
            attributes: ['id', 'name'],
        })

        apps.forEach(app => (app.mode = null))

        companies.forEach(company => {
            company.apps = apps
            company.access = false
        })

        res.send(companies)
    },
}
