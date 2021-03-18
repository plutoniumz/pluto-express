const { PlutoExpress } = require('./src/pluto-express')

const hooks = require('./hooks')

const plutoExpress = new PlutoExpress({
    port: 1337,
    hooks: hooks,
})

plutoExpress.start()
