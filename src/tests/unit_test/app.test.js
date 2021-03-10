const App = require('../../app')

describe('App', () => {
    describe('constructor', () => {
        it('should call the functions correctly', () => {
            const initAppConfigs = jest.spyOn(App.prototype, 'initAppConfigs')
            const initAppModels = jest.spyOn(App.prototype, 'initAppModels')
            const defineGlobalVariables = jest.spyOn(
                App.prototype,
                'defineGlobalVariables',
            )

            new App()

            expect(defineGlobalVariables).toHaveBeenCalledTimes(1)
            expect(initAppConfigs).toHaveBeenCalledTimes(1)
            expect(initAppModels).toHaveBeenCalledTimes(1)
        })
    })

    describe('defineGlobalVariables', () => {
        beforeEach(() => {
            jest.spyOn(
                App.prototype,
                'initAppConfigs',
            ).mockImplementationOnce(() => {})
            jest.spyOn(
                App.prototype,
                'initAppModels',
            ).mockImplementationOnce(() => {})
        })

        it('should define the global variables correctly', () => {
            new App()

            expect(global.async).toBe(require('async'))
            expect(global.Sequelize).toBe(require('sequelize'))
            expect(global.chalk).toBe(require('chalk'))
        })
    })

    describe('initAppConfigs', () => {
        beforeEach(() => {
            jest.spyOn(
                App.prototype,
                'initAppModels',
            ).mockImplementationOnce(() => {})
        })

        it('should initialize app configs correctly', () => {
            new App()

            expect(global.app.configs).toBe(require('../../../configs'))
        })
    })

    describe('initAppModels', () => {
        it('should initialize app models correctly', () => {
            new App()

            expect(global.app.models).toBe(
                require('../../middlewares/sequelize/models/App'),
            )
        })
    })

    describe('initMiddlewares', () => {
        it('should initialize app middlewares correctly', async () => {
            global.app.configs.middlewares = require('../../configs/middlewares')
            global.app.configs.middlewares.forEach(name => {
                jest.mock(`../../src/middlewares/${name}`, () => ({
                    init: jest.fn(),
                }))
            })

            const app = new App()
            await app.start()

            global.app.configs.middlewares.forEach(name => {
                const init = require(`../../src/middlewares/${name}`).init
                expect(init).toHaveBeenCalledTimes(1)
            })
        })
    })

    describe('start', () => {
        it('should call the functions correctly', () => {
            const initMiddlewares = jest
                .spyOn(App.prototype, 'initMiddlewares')
                .mockResolvedValueOnce(null)

            new App().start()

            expect(initMiddlewares).toHaveBeenCalledTimes(1)
        })
    })
})
