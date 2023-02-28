const jwt = require('jsonwebtoken')
const ApiError = require("../exceptions/apiError")

module.exports = function (userRole) {
  return function (req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')[1]
      if (!token) {
        return next(ApiError.UnauthorizedError())
      }
      const {role} = jwt.verify(token, process.env.JWT_ACCESS_KEY)
      let hasRole = false
      if (userRole.includes(role)) {
        hasRole = true
      }
      if (!hasRole) {
        return next(ApiError.UnauthorizedError())
      }
      next()
    } catch (e) {
      return next(ApiError.UnauthorizedError())
    }
  }
}
