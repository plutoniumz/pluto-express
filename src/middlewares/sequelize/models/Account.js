const bcrypt = require('bcryptjs')
const { DataTypes } = Sequelize

module.exports = {
    attributes: {
        username: {
            type: DataTypes.STRING,
            required: true,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            required: true,
            protect: true,
        },
        is_admin: {
            type: 'boolean',
            defaultValue: false,
        },
        is_active: {
            type: 'boolean',
            defaultValue: true,
        },
    },

    options: {
        defaultScope: {
            attributes: { exclude: ['password'] },
        },
        hooks: {
            beforeBulkCreate: instances => {
                instances.forEach(instance => {
                    if (!instance.password) return

                    instance.password = bcrypt.hashSync(instance.password, 10)
                })
            },
            beforeCreate: instance => {
                if (!instance.password) return

                instance.password = bcrypt.hashSync(instance.password, 10)
            },
        },
        customMethods: {
            getOne: async employeeId => {
                const employee = await Account.findOne({
                    where: {
                        id: employeeId,
                    },
                })

                const result = employee.toJSON()

                result.companies = await Account.getPermission(employee.id)

                return result
            },

            getPermission: async employeeId => {
                const companyPermissions = await Tenant.findAll({
                    attributes: ['id'],
                    include: [
                        {
                            model: Permission,
                            include: [Mode, App],
                            where: { AccountId: employeeId },
                        },
                    ],
                })

                const companies = []

                companyPermissions.forEach(companyPermission => {
                    const company = {}

                    company.id = companyPermission.id
                    company.name = companyPermission.name

                    const apps = []
                    companyPermission.Permissions.forEach(appPermission => {
                        const app = {}

                        app.id = appPermission.App.id
                        app.name = appPermission.App.name
                        app.mode = appPermission.Mode
                            ? appPermission.Mode.name
                            : null
                        company.access = appPermission.access

                        apps.push(app)
                    })

                    company.apps = apps

                    companies.push(company)
                })

                return companies
            },
        },
    },
}
