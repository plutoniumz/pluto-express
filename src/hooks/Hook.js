class Hook {
    constructor(settings = {}, name) {
        this.configs = settings[name].configs
        this.modules = settings[name].modules
        this.settings = settings
    }
}

module.exports = Hook
