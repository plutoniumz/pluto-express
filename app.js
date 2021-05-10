const { PlutoExpress } = require('./src/pluto-express')

const plutoExpress = new PlutoExpress({
    port: 1337,
    hooks: {},
})

plutoExpress.start()
