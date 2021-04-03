class Session {
    constructor(store) {
        this.store = store
    }

    clearAllSessions() {
        this.store.clear()
    }

    getEmployee(req) {
        return req.session.employee
    }

    setEmployee(req, employee) {
        if (!this.hasEmployee(req)) {
            req.session.employee = {}
            req.session.employee.id = employee.id
            req.session.employee.is_admin = employee.is_admin
            req.session.employee.is_active = employee.is_active
            req.session.employee.avatar = employee.avatar
            req.session.employee.name = employee.name
        }
    }

    deleteEmployee(req) {
        req.session.destroy()
    }

    hasEmployee(req) {
        return !!(req.session && req.session.employee)
    }
}

module.exports = Session
