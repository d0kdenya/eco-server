const ApiError = require("../exceptions/apiError");
const {User, Government, Departments} = require("../models/models");
const UserDto = require("../dtos/user-dto");
const DepartmentsDto = require('../dtos/departmentsDto')
const GovernmentProfileDto = require("../dtos/governmentProfileDto");
const bcrypt = require("bcrypt");
const dadata = require('dadata')(process.env.DADATA_API_KEY, process.env.DADATA_SECRET_KEY)

class AdminService {
  async activateGovernment(governmentId, isActivated) {
    if (!governmentId) {
      throw ApiError.BadRequest('Некорректный userId')
    } else if (isActivated === null || isActivated === undefined) {
      throw ApiError.BadRequest('Некорректное поле \"isActivated\"')
    }
    const candidate = await Government.findOne({where: {id: governmentId}})

    if (!candidate) {
      throw ApiError.BadRequest('Пользователь не найден!')
    }
    return await Government.update({isActivated}, {where: {id: governmentId}})
  }

  async getAllUsers(page, size) {
    const users = await User.findAndCountAll({
      limit: size,
      offset: page * size,
      order: ['id']
    })
    const count = users.count

    let findedUsers = []

    for (let i = 0; i < users.rows.length; i++) {
      findedUsers.push(new UserDto(users.rows[i]))
    }
    return {findedUsers, count}
  }

  async getAllGovernments(page, size) {
    const governments = await Government.findAndCountAll({
      limit: size,
      offset: page * size,
      order: ['id']
    })
    const count = governments.count

    let findedGovernments = []

    for (let i = 0; i < governments.rows.length; i++) {
      findedGovernments.push(new UserDto(governments.rows[i]))
    }
    return {findedGovernments, count}
  }

  async allDepartments(page, size) {
    const departments = await Departments.findAndCountAll({
      limit: size,
      offset: page * size,
      order: ['id']
    })
    const count = departments.count
    let findedDepartments = []

    for (let i = 0; i < departments.rows.length; i++) {
      findedDepartments.push(new DepartmentsDto(departments.rows[i]))
    }
    return {findedDepartments, count}
  }

  async getDepartmentById(id) {
    if (!id) {
      throw ApiError.BadRequest('Некорректный id')
    }
    const department = await Departments.findOne({where: {id}})

    if (!department) {
      throw ApiError.BadRequest('Департамент не найден')
    }
    return new DepartmentsDto(department)
  }

  async registerGovernment(government) {
    if (!government){
      throw ApiError.BadRequest('Некоректный объект government')
    }
    const hashPassword = await bcrypt.hash(government.password, 12)
    return new GovernmentProfileDto (await Government.create({
          email: government.email,
          password: hashPassword,
          lastname: government.lastname,
          name: government.name,
          patronymic: government.patronymic,
          number: government.number,
          sex: government.sex,
          isActivated: true,
          isVerified: true,
          isBanned: false,
          role: 'GOVERNMENT'
        })
    )
  }

  async banUser(id, isBanned) {
    if (!id) {
      throw ApiError.BadRequest('Некорректный id!')
    } else if (isBanned === null || isBanned === undefined) {
      throw ApiError.BadRequest('Некорректное поле \"isBanned\"!')
    }

    const user = await User.findOne({where: {id}})

    if (!user) {
      throw ApiError.BadRequest('Пользователь не найден!')
    }
    return await User.update({ isBanned }, {where: {id: id}})
  }

  async banGovernment(id , isBanned) {
    if (!id) {
      throw ApiError.BadRequest('Некорректный id!')
    } else if (isBanned === null || isBanned === undefined) {
      throw ApiError.BadRequest('Некорректное поле "isBanned"!')
    }

    const government = await Government.findOne({where: {id}})

    if (!government) {
      throw ApiError.BadRequest('Гос служащий не найден!')
    }
    return await Government.update({isBanned}, {where: {id: id}})
  }

  async createDepartment(department) {
    if (!department) {
      throw ApiError.BadRequest('Некорректный департамент!')
    }

    return new DepartmentsDto(await Departments.create({
      name: department.name,
      latitudeOne: department.latitudeOne,
      longitudeOne: department.longitudeOne,
      latitudeTwo: department.latitudeTwo,
      longitudeTwo: department.longitudeTwo,
      latitudeThree: department.latitudeThree,
      longitudeThree: department.longitudeThree,
      latitudeFour: department.latitudeFour,
      longitudeFour: department.longitudeFour,
    }))
  }

  async setDepartment(governmentId, departmentId) {
    if (!governmentId || !departmentId) {
      throw ApiError.BadRequest('Некорректный id гос служащего или департамента!')
    }
    const government = await Government.findOne({where: {id: governmentId}})
    const department = await Departments.findOne({where: {id: departmentId}})

    if (!government) {
      throw ApiError.BadRequest('Гос служащий не найден!')
    } else if (!department) {
      throw ApiError.BadRequest('Департамент не найден!')
    }

    return await Government.update({departmentId}, {where: {id: governmentId}})
  }

  async unsetDepartment(governmentId) {
    if (!governmentId) {
      throw ApiError.BadRequest('Некорректный id гос служащего!')
    }
    const government = await Government.findOne({where: {id: governmentId}})

    if (!government) {
      throw ApiError.BadRequest('Гос служащий не найден!')
    }

    return await Government.update({departmentId: null}, {where: {id: governmentId}})
  }

  async changeDepartment(department) {
    if (!department) {
      throw ApiError.BadRequest('Некорректный департамент!')
    }
    const currentDepartment = await Departments.findOne({where: {id: department.id}})

    if (!currentDepartment) {
      throw ApiError.BadRequest('Департамент не найден!')
    }
    return await Departments.update({
      name: department.name,
      latitudeOne: department.latitudeOne,
      longitudeOne: department.longitudeOne,
      latitudeTwo: department.latitudeTwo,
      longitudeTwo: department.longitudeTwo,
      latitudeThree: department.latitudeThree,
      longitudeThree: department.longitudeThree,
      latitudeFour: department.latitudeFour,
      longitudeFour: department.longitudeFour,
    }, {where: {id: department.id}})
  }

  async deleteUser(id) {
    if (!id) {
      throw ApiError.BadRequest('Некорректный id!')
    }
    const user = await User.findOne({where: {id}})
    if (!user) {
      throw ApiError.BadRequest('Пользователь не найден!')
    }
    return await User.destroy({where: {id}})
  }

  async deleteGovernment(governmentId) {
    if (!governmentId) {
      throw ApiError.BadRequest('Некорректный id гос служащего!')
    }
    const government = await Government.findOne({ where: { id: governmentId }})
    if (!government) {
      throw ApiError.BadRequest('Гос служащий не найден!')
    }
    return await Government.destroy({where: { id: governmentId }})
  }

  async deleteDepartment(departmentId) {
    if (!departmentId) {
      throw ApiError.BadRequest('Некорректный id департамента!')
    }
    const department = await Departments.findOne({where: {id: departmentId}})

    if (!department) {
      throw ApiError.BadRequest('Департамент не найден!')
    }
    const governments = await Government.findAll({where: {departmentId}})

    for (const government of governments) {
      await Government.update({departmentId: null}, {where: {id: government.id}})
    }
    return await Departments.destroy({where: {id: departmentId}})
  }
}

module.exports = new AdminService()