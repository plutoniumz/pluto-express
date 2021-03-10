require('mysql2/node_modules/iconv-lite').encodingExists('foo')
global.Sequelize = undefined
global.async = undefined
global.chalk = undefined
jest.mock('express', () => () => ({
    listen: jest.fn(),
}))
global.app = {
    configs: {},
}
