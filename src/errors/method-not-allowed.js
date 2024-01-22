const MetthodNotAllowed = (req, res, next) => {
    next({
        status: 405,
        message: `${req.method} not allowd for ${req.originalUrl}`
    })
}

module.exports = MetthodNotAllowed