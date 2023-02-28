const governmentService = require("../services/governmentService");

class GovernmentController {
  async getProfile(req, res, next) {
    try {
      const {id} = req.user
      const government = await governmentService.getProfile(id)
      return res.json(government)
    } catch (e) {
      next(e)
    }
  }

  async getViolations(req, res, next) {
    try {
      const {id} = req.user
      const violations = await governmentService.getViolations(id)
      return res.json(violations)
    } catch (e) {
      next(e)
    }
  }

  async updateProfile(req, res, next) {
    try {
      const {id} = req.user
      const {government} = req.body
      const governmentProfile = await governmentService.updateProfile(id, government)
      return res.json(governmentProfile)
    } catch (e) {
      next(e)
    }
  }

  async changeViolationStatus(req, res, next) {
    try {
      const {id} = req.user
      const {violationId, status} = req.body
      const violation = await governmentService.changeViolationStatus(id, violationId, status)
      return res.json(violation)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new GovernmentController()