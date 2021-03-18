module.exports = {
    attributes: {
        ...require('../models/Company').attributes,
    },
    options: {
        customMethods: {
            getAll: async () => {
                return await Company.findAll({
                    attributes: ['id', 'name', 'code'],
                    raw: true,
                })
            },
        },
    },
}
