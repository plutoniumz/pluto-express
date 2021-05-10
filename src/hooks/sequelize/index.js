module.exports = {
    configs: {
        modelConnections: {},
        connections: {
            master: {
                database: 'pluto_master',
                dialect: 'sqlite',
                storage: 'pluto_master.sqlite',
                force: true,
                logging: false,
            },
            slave: {
                database: 'pluto_slave',
                dialect: 'sqlite',
                storage: 'pluto_slave.sqlite',
                force: true,
                logging: false,
            },
        },
        defaultAttributes: {},
        associations: () => {},
    },
}
