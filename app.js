const { PlutoExpress } = require('./build/pluto-express')

const plutoExpress = new PlutoExpress({
    port: 1337,
    hooks: {},
})

plutoExpress.start()
