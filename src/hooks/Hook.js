class Hook {
    constructor(settings = {}, name) {
        this.on = this.startOn()
        this.name = name
        this.configs = settings[name].configs
        this.modules = settings[name].modules
        this.settings = settings
    }

    startOn() {}

    init() {}
}

module.exports = Hook
