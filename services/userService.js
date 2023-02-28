const ApiError = require("../exceptions/apiError");
const {User, Violation} = require("../models/models");
const UserProfileDto = require("../dtos/userProfileDto")
const UsersViolationsDto = require("../dtos/usersViolationsDto");
const deleteFiles = require('../utils/deleteFiles')

class UserService {
  async getProfile(id) {
    if (!id) {
      throw ApiError.UnauthorizedError()
    }
    const profile = await User.findOne({where: {id}})

    return new UserProfileDto(profile)
  }

  async getAllUsersViolations(id) {
    if (!id) {
      throw ApiError.UnauthorizedError()
    }
    const violations = await Violation.findAll({where: {userId: id}})

    return violations.map(violation => {
      return new UsersViolationsDto(violation)
    })
  }

  async updateProfile(id, email, user) {
    if (!id) {
      throw ApiError.UnauthorizedError()
    }
    if (!user) {
      throw ApiError.BadRequest('Объект user пуст!')
    }

    return await User.update({
      email: email,
      department: user.department,
      lastname: user.lastname,
      name: user.name,
      patronymic: user.patronymic,
      number: user.number,
      sex: user.sex
    }, {
      where: {id}
    })
  }

  async uploadViolation(id, violation, violationId) {
    if (!id) {
      throw ApiError.UnauthorizedError()
    } else if (!violation || typeof (violation) === 'undefined') {
      throw ApiError.BadRequest('Некорректный файл!')
    } else if (!violationId) {
      throw ApiError.BadRequest('Некорректный id нарушения')
    }
    const candidate = await Violation.findOne({where: {id: violationId}})

    if (!candidate) {
      throw ApiError.BadRequest('Нарушение не найдено')
    }

    let paths = []

    Object.values(violation).forEach(value => {
      paths.push(value.path)
    })
    await Violation.update({userId: id, file: paths}, {where: {id: violationId}})

    return `Файл был успешно загружен!`
  }

  async setViolationInfo(id, violation) {
    if (!violation) {
      throw ApiError.BadRequest('Объект пуст!')
    } else if (!id) {
      throw ApiError.UnauthorizedError()
    } else if (!violation.latitude || !violation.longitude) {
      throw ApiError.BadRequest('Некорректные координаты')
    }

    return await Violation.create({
      name: violation.name,
      description: violation.description,
      latitude: violation.latitude,
      longitude: violation.longitude
    })
  }

  async sendViolation(id, violationId) {
    if (!id) {
      throw ApiError.UnauthorizedError()
    }
    return await Violation.update({violationStatus: 'waiting'}, {where: {id: violationId, userId: id}})
  }

  async uploadProfilePhoto(id, photoProfile) {
    if (!id || !photoProfile || typeof (photoProfile) === 'undefined') {
      throw ApiError.BadRequest('Непредвиденная ошибка!')
    }
    const candidate = await User.findOne({where: {id}})

    if (!candidate) {
      throw ApiError.BadRequest('Пользователь не найден!')
    }
    const files = candidate.photo
    deleteFiles(files, `${require.main.path}`)
    let paths = []

    Object.values(photoProfile).forEach(value => {
      paths.push(value.path)
    })
    await User.update({photo: paths}, {where: {id}})

    return `Файл был успешно загружен!`
  }

  async deleteProfilePhoto(id, photoProfile) {
    if (!id || !photoProfile || typeof (photoProfile) === 'undefined') {
      throw ApiError.BadRequest('Непредвиденная ошибка!')
    }
    const candidate = await User.findOne({where: {id}})

    if (!candidate) {
      throw ApiError.BadRequest('Пользователь не найден!')
    }
    const files = candidate.photo
    const updatedFiles = {...files.filter(file => file !== photoProfile)}
    deleteFiles(photoProfile, `${require.main.path}`)

    await User.update({photo: Object.values(updatedFiles)}, {where: {id}})
    return `${photoProfile} успешно удалён!`
  }
}

module.exports = new UserService()