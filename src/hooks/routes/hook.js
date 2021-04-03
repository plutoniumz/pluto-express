const path = require('path')
const Hook = require('../Hook')
const express = require('express')

class RouteHook extends Hook {
    init() {
        Object.entries(this.configs).forEach(([address, target]) => {
            const url = address.split(' ')[1]
            const httpMethod = address.split(' ')[0].toLowerCase()
            const moduleName = target.split('.')[0]
            const methodName = target.split('.')[1]

            const module = this.modules[moduleName]

            app[httpMethod](url, module[methodName])
        })

        app.use('/files', express.static('files'))
    }
}

module.exports = RouteHook
