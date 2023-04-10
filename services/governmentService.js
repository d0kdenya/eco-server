const ApiError = require("../exceptions/apiError");
const tokenService = require("./tokenService");
const {User, Government, Violation, Departments, GarbageClass} = require("../models/models");
const UserDto = require("../dtos/user-dto");
const ViolationsDto = require("../dtos/violationsDto")
const GovernmentProfileDto = require("../dtos/governmentProfileDto")
const {Op} = require('sequelize')
const {logger} = require("sequelize/lib/utils/logger");

class GovernmentService {
  async getProfile(id) {
    if (!id) {
      throw ApiError.BadRequest("Некорректный id")
    }
    const government = await Government.findOne({where: {id}})
    if (!government) {
      throw ApiError.BadRequest("Госслужащий не найден")
    }
    return new GovernmentProfileDto(government)
  }

  async getViolations(id) {
    const government = await Government.findOne({where: {id}})
    const department = await Departments.findOne({where: {id: government.departmentId}})
    const violations = await Violation.findAll({
      where: {
        [Op.and]: [
          {
            latitude: {
              [Op.between]: [
                department.latitudeThree,
                department.latitudeOne
              ]
            },
            longitude: {
              [Op.between]: [
                department.longitudeOne,
                department.longitudeThree
              ]
            }
          }
        ]
      }
    })
    let garbage = []

    for (let violation of violations) {
      garbage.push(await GarbageClass.findOne({where: { id: violation.garbageClassId }}))
    }

    return violations.map(violation => {
      const result = new ViolationsDto(violation, garbage)
      console.log('result: ', result)
      return result
    })
  }

  async getGarbageClasses(id) {
    const government = await Government.findOne({where: {id}})

    if (!government) {
      throw ApiError.BadRequest('Гос служащий не найден!')
    }
    const classes = await GarbageClass.findAll()

    return classes.map(garbage => {
      return {
        id: garbage.id,
        name: garbage.name
      }
    })
  }

  async updateProfile(id, government) {
    if (!id) {
      throw ApiError.BadRequest("Некорректный id")
    } else if (!government) {
      throw ApiError.BadRequest("Некорректный госслужащий")
    }
    const candidate = await Government.findOne({where: {id}})
    if (!candidate) {
      throw ApiError.BadRequest("Госслужащий не найден")
    }

    const governmentProfile = await Government.update({
      email: government.email,
      lastname: government.lastname,
      name: government.name,
      patronymic: government.patronymic,
      number: government.number,
      sex: government.sex
    }, {
      where: {id}
    })
    return governmentProfile
  }

  async changeViolationStatus(id, violationId, status) {
    if (!violationId) {
      throw ApiError.BadRequest('Некорректный id нарушения!')
    } else if (!status) {
      throw ApiError.BadRequest('Некорректный статус!')
    }
    const violation = await Violation.findOne({where: {id: violationId}})

    if (!violation) {
      throw ApiError.BadRequest('Нарушение не найдено!')
    }

    return await Violation.update({violationStatus: status}, {where: {id: violationId}})
  }

  async changeGarbageClass(id, violationId, isAcceptedClass) {
    if (!violationId) {
      throw ApiError.BadRequest('Некорректный id нарушения!')
    } else if (!isAcceptedClass) {
      throw ApiError.BadRequest('Некорректный статус!')
    }
    const violation = await Violation.findOne({where: {id: violationId}})

    if (!violation) {
      throw ApiError.BadRequest('Нарушение не найдено!')
    }
    return await Violation.update({ isAcceptedClass }, {where: {id: violationId}})
  }
}

module.exports = new GovernmentService()