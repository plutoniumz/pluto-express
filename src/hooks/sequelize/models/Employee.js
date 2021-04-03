const bcrypt = require('bcryptjs')
const { DataTypes } = Sequelize

module.exports = {
    attributes: {
        username: {
            type: DataTypes.STRING,
            required: true,
            unique: 'username',
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
        ...(require('../../../../hooks/sequelize/models/Employee').attributes ||
            {}),
    },

    options: {
        defaultScope: {
            attributes: { exclude: ['password'] },
        },
        hooks: {
            beforeBulkCreate: instances => {
                instances.forEach(instance => {
                    if (!instance.password) return

                    instance.password = Employee.hashPassword(instance.password)
                })
            },
            beforeCreate: instance => {
                if (!instance.password) return

                instance.password = Employee.hashPassword(instance.password)
            },
            beforeUpdate: instance => {
                if (!instance.password) return

                instance.password = Employee.hashPassword(instance.password)
            },
        },
        customMethods: {
            /*getOne: async () => {
                result.companies = await Employee.getPermission(
                    session.getEmployeeId(req),
                )

                return result
            },*/

            updateOneById: async (data, id) => {
                await Employee.update(data, {
                    where: {
                        id: id,
                    },
                })
            },

            hashPassword: password => bcrypt.hashSync(password, 10),

            checkPassword: (firstPassword, secondPassword) => {
                return bcrypt.compareSync(firstPassword, secondPassword)
            },

            getOneWithPasswordById: async id => {
                return await Employee.findOne({
                    attributes: {
                        include: ['password'],
                    },
                    where: {
                        id: id,
                        is_active: 1,
                    },
                    plain: true,
                })
            },

            getOneWithPasswordByUsername: async username => {
                return await Employee.findOne({
                    attributes: {
                        include: ['password'],
                    },
                    where: {
                        username: username,
                        is_active: 1,
                    },
                    plain: true,
                })
            },

            getEmployeeApps: async (id, companyId) => {
                const apps = await Permission.findAll({
                    attributes: [
                        [
                            Sequelize.fn('DISTINCT', Sequelize.col('AppId')),
                            'id',
                        ],
                    ],
                    include: [
                        {
                            model: Mode,
                        },
                        {
                            model: App,
                        },
                    ],
                    where: {
                        EmployeeId: id,
                        CompanyId: companyId,
                    },
                    raw: true,
                })

                return apps.map(app => ({
                    id: app['App.id'],
                    name: app['App.name'],
                    mode: app['Mode.name'],
                }))
            },

            getEmployeeCompanies: async id => {
                const companies = await Permission.findAll({
                    attributes: [
                        [
                            Sequelize.fn(
                                'DISTINCT',
                                Sequelize.col('CompanyId'),
                            ),
                            'id',
                        ],
                    ],
                    where: {
                        EmployeeId: id,
                    },
                    raw: true,
                })

                return companies.map(company => company.id)
            },

            getPermission: async id => {
                const companies = await Employee.getEmployeeCompanies(id)
                const allCompanies = await Company.getAll()

                await async.eachOf(allCompanies, async company => {
                    company.access = companies.includes(company.id)
                    company.apps = await Employee.getEmployeeApps(
                        id,
                        company.id,
                    )
                })

                return allCompanies
            },
        },
        ...(require('../../../../hooks/sequelize/models/Employee').options ||
            {}),
    },
}
