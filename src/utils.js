const fs = require('fs')
const { join } = require('path')

getUserPath = name => join(process.cwd(), name)

/*getRouteData = (address, target) => {
    const { url, httpMethod } = this.getAddressData(address)

    return {
        url: url,
        method: target.split('.')[1],
        controller: target.split('.')[0],
        httpMethod: httpMethod,
    }
}*/

requireUserFile = path => {
    try {
        return eval('require(path)')
    } catch (ex) {
        if (ex.code === 'MODULE_NOT_FOUND') error(`${path} is not found`)
        else {
            throw new ex()
        }

        process.exit()
    }
}

module.exports = {
    getUserPath: getUserPath,
    requireUserFile: requireUserFile,
}
