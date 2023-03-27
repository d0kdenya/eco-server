/*
const userService = require('../services/userService')

class UserController {
  async getProfile(req, res, next) {
    try {
      // Берём id из токена
      const {id} = req.user
      const profile = await userService.getProfile(id)
      return res.json(profile)
    } catch (e) {
      next(e)
    }
  }

  async getAllUsersViolations(req, res, next) {
    try {
      const {id} = req.user
      const violations = await userService.getAllUsersViolations(id)
      return res.json(violations)
    } catch (e) {
      next(e)
    }
  }

  async updateProfile(req, res, next) {
    try {
      const {id, email} = req.user
      const {user} = req.body
      const profile = await userService.updateProfile(id, email, user)
      return res.json(profile)
    } catch (e) {
      next(e)
    }
  }

  async uploadViolation(req, res, next) {
    try {
      const {id} = req.user
      const {vid} = req.headers
      const violation = {...req.files}
      const files = await userService.uploadViolation(id, violation, vid)
      return res.json(files)
    } catch (e) {
      next(e)
    }
  }

  async setViolationInfo(req, res, next) {
    try {
      const {id} = req.user
      const {violation} = req.body
      const files = await userService.setViolationInfo(id, violation)
      return res.json(files)
    } catch (e) {
      next(e)
    }
  }

  async sendViolation(req, res, next) {
    try {
      const {id} = req.user
      const {violationId} = req.body
      const violation = await userService.sendViolation(id, violationId)
      return res.json(violation)
    } catch (e) {
      next(e)
    }
  }

  async uploadProfilePhoto(req, res, next) {
    try {
      const {id} = req.user
      const photoProfile = {...req.files}
      const photo = await userService.uploadProfilePhoto(id, photoProfile)
      return res.json(photo)
    } catch (e) {
      next(e)
    }
  }

  async deleteProfilePhoto(req, res, next) {
    try {
      const {id} = req.user
      const {photoProfile} = req.body
      const result = await userService.deleteProfilePhoto(id, photoProfile)
      return res.json(result)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new UserController()*/
