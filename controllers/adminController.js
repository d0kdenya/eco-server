const adminService = require("../services/adminService");

class AdminController {
  async activateGovernment(req, res, next) {
    try {
      const {governmentId, isActivated} = req.body
      const activate = await adminService.activateGovernment(governmentId, isActivated)
      return res.json(activate)
    } catch (e) {
      next(e)
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const pageAsNumber = Number.parseInt(req.query.page)
      const sizeAsNumber = Number.parseInt(req.query.size)

      let page = 0
      if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
        page = pageAsNumber
      }

      let size = 10
      if (!Number.isNaN(pageAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 50) {
        size = sizeAsNumber
      }

      const {findedUsers, count} = await adminService.getAllUsers(page, size)

      return res.json({
        count,
        page,
        limit: size,
        totalPages: Math.ceil(count / size),
        content: findedUsers
      })
    } catch (e) {
      next(e)
    }
  }

  async getAllGovernments(req, res, next) {
    try {
      const pageAsNumber = Number.parseInt(req.query.page)
      const sizeAsNumber = Number.parseInt(req.query.size)

      let page = 0
      if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
        page = pageAsNumber
      }

      let size = 10
      if (!Number.isNaN(pageAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 50) {
        size = sizeAsNumber
      }

      const {findedGovernments, count} = await adminService.getAllGovernments(page, size)

      return res.json({
        count,
        page,
        limit: size,
        totalPages: Math.ceil(count / size),
        content: findedGovernments
      })
    } catch (e) {
      next(e)
    }
  }

  async allDepartments(req, res, next) {
    try {
      const pageAsNumber = Number.parseInt(req.query.page)
      const sizeAsNumber = Number.parseInt(req.query.size)

      let page = 0
      if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
        page = pageAsNumber
      }

      let size = 10
      if (!Number.isNaN(pageAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 50) {
        size = sizeAsNumber
      }

      const {findedDepartments, count} = await adminService.allDepartments(page, size)

      return res.json({
        count,
        page,
        limit: size,
        totalPages: Math.ceil(count / size),
        content: findedDepartments
      })
    } catch (e) {
      next(e)
    }
  }

  async getDepartmentById(req, res, next) {
    try {
      const {id} = req.params
      const department = await adminService.getDepartmentById(id)
      return res.json(department)
    } catch (e) {
      next(e)
    }
  }

  async registerGovernment(req, res, next) {
    try {

      return res.json()
    } catch (e) {
      next(e)
    }
  }

  async banUser(req, res, next) {
    try {
      const {id} = req.params
      const {isBanned} = req.body
      const ban = await adminService.banUser(id, isBanned)
      return res.json(ban)
    } catch (e) {
      next(e)
    }
  }

  async banGovernment(req, res, next) {
    try {

      return res.json()
    } catch (e) {
      next(e)
    }
  }

  async createDepartment(req, res, next) {
    try {
      const {department} = req.body
      const newDepartment = await adminService.createDepartment(department)
      return res.json(newDepartment)
    } catch (e) {
      next(e)
    }
  }

  async setDepartment(req, res, next) {
    try {
      const {governmentId, departmentId} = req.body
      const department = await adminService.setDepartment(governmentId, departmentId)
      return res.json(department)
    } catch (e) {
      next(e)
    }
  }

  async unsetDepartment(req, res, next) {
    try {
      const {governmentId} = req.body
      const department = await adminService.unsetDepartment(governmentId)
      return res.json(department)
    } catch (e) {
      next(e)
    }
  }

  async changeDepartment(req, res, next) {
    try {
      const {department} = req.body
      const newDepartment = await adminService.changeDepartment(department)
      return res.json(newDepartment)
    } catch (e) {
      next(e)
    }
  }

  async deleteUser(req, res, next) {
    try {
      const {id} = req.params
      const user = await adminService.deleteUser(id)
      return res.json(user)
    } catch (e) {
      next(e)
    }
  }

  async deleteGovernment(req, res, next) {
    try {

      return res.json()
    } catch (e) {
      next(e)
    }
  }

  async deleteDepartment(req, res, next) {
    try {
      const {departmentId} = req.body
      const department = await adminService.deleteDepartment(departmentId)
      return res.json(department)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new AdminController()