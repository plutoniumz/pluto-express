class RequestMiddleware {
    init() {
        app.use('*', (req, res, next) => {
            try {
                const { company_id, is_active } = JSON.parse(req.query.where)

                // Add company id to request
                if (company_id) req.company_id = parseInt(company_id)

                // Add company id to request body
                if (company_id && req.body)
                    req.body.company_id = parseInt(company_id)

                // Add is active to request
                req.isActive = !is_active ? true : is_active

                // Add employee id to request body
                req.body.employee_id = req.session.employee_id
            } catch (ex) {}
            next()
        })
    }
}

module.exports = new RequestMiddleware().init()
