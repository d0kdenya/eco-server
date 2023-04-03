const {User, Government, Admin} = require('../models/models')
const ApiError = require('../exceptions/apiError');
const bcrypt = require('bcrypt');
const uuid = require('uuid')
const mailService = require('./mailService')
const tokenService = require('./tokenService')
const UserDto = require('../dtos/user-dto')

class AuthService {
  async registration(email, password, role) {
    if (!email || !password) {
      throw ApiError.BadRequest('Некорректный email или password')
    } else if (!role) {
      throw ApiError.BadRequest('Некорректная роль')
    }
    const candidate = await User.findOne({where: {email}})
      || await Government.findOne({where: {email}})
      || await Admin.findOne({where: {email}})

    if (candidate) {
      throw ApiError.BadRequest(`Пользователь с email: ${email} уже существует`)
    }

    const hashPassword = await bcrypt.hash(password, 12)
    const activationLink = uuid.v4()
    let user

    switch (role) {
      case 'USER': {
        user = await User.create({email, password: hashPassword, role: 'USER', activationLink })
        break
      }
      case 'GOVERNMENT': {
        user = await Government.create({email, password: hashPassword, role: 'GOVERNMENT', activationLink})
        break
      }
      case 'ADMIN': {
        user = await Admin.create({email, password: hashPassword, role: 'ADMIN', activationLink})
        break
      }
      default: {
        throw ApiError.BadRequest(`Некорректная роль!`)
      }
    }
    await mailService.sendActivationMail(email, `${ process.env.API_URL }/api/auth/activate/${activationLink}`)

    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({...userDto})

    await tokenService.saveToken(userDto.id, tokens.refreshToken, role)

    return {
      ...tokens,
      user: userDto
    }
  }

  async activate(activationLink) {
    const user = await User.findOne({where: {activationLink}})
    const government = await Government.findOne({where: {activationLink}})
    const admin = await Admin.findOne({where: {activationLink}})

    if (!user && !government && !admin) {
      throw ApiError.BadRequest('Некорректная ссылка активации')
    }

    if (user && !government && !admin) {
      return await User.update({isVerified: true, activationLink: ''}, {where: {activationLink}})
    } else if (!user && government && !admin) {
      return await Government.update({isVerified: true, activationLink: ''}, {where: {activationLink}})
    } else {
      return await Admin.update({isVerified: true, activationLink: ''}, {where: {activationLink}})
    }
  }

  async login(email, password, role) {
    if (!role) {
      throw ApiError.BadRequest('Некорректная роль')
    }

    switch (role) {
      case 'USER': {
        const user = await User.findOne({where: {email}})

        if (!user) {
          throw ApiError.BadRequest(`${email} не зарегистрирован`)
        }
        if (!user.isVerified) {
          throw ApiError.UnactivatedError()
        }
        let comparePassword = await bcrypt.compare(password, user.password)

        if (!comparePassword) {
          throw ApiError.BadRequest('Неверный пароль')
        }
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken, role)

        const token = uuid.v4()

        await User.update({ authToken: token }, { where: { id: user.id } })

        return {
          token
        }
      }
      case 'GOVERNMENT': {
        const government = await Government.findOne({where: {email}})

        if (!government) {
          throw ApiError.BadRequest(`${email} не зарегистрирован`)
        }
        if (!government.isVerified) {
          throw ApiError.UnactivatedError()
        }
        if (!government.isActivated) {
          throw ApiError.BadRequest(`Пользователю не активировали аккаунт`)
        }
        let comparePassword = await bcrypt.compare(password, government.password)

        if (!comparePassword) {
          throw ApiError.BadRequest('Неверный пароль')
        }
        const governmentDto = new UserDto(government)
        const tokens = tokenService.generateTokens({...governmentDto})
        await tokenService.saveToken(governmentDto.id, tokens.refreshToken, role)

        return {
          ...tokens,
          government: governmentDto
        }
      }
      case 'ADMIN': {
        const admin = await Admin.findOne({where: {email}})

        if (!admin) {
          throw ApiError.BadRequest(`${email} не зарегистрирован`)
        }
        if (!admin.isVerified) {
          throw ApiError.UnactivatedError()
        }
        let comparePassword = await bcrypt.compare(password, admin.password)

        if (!comparePassword) {
          throw ApiError.BadRequest('Неверный пароль')
        }
        const adminDto = new UserDto(admin)
        const tokens = tokenService.generateTokens({...adminDto})
        await tokenService.saveToken(adminDto.id, tokens.refreshToken, role)

        return {
          ...tokens,
          admin: adminDto
        }
      }
      default: {
        throw ApiError.BadRequest('Некорректная роль')
      }
    }
  }

  async logout(refreshToken) {
    return await tokenService.removeToken(refreshToken)
  }

  async refresh(refreshToken, role) {
    if (!refreshToken) {
      return new ApiError.UnauthorizedError()
    }
    if (!role) {
      throw ApiError.BadRequest('Некорректная роль')
    }

    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDb = await tokenService.findToken(refreshToken)

    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError()
    }
    let userDto

    switch (role) {
      case 'USER': {
        const user = await User.findByPk(userData.id)
        userDto = new UserDto(user)
        break
      }
      case 'GOVERNMENT': {
        const government = await Government.findByPk(userData.id)
        userDto = new UserDto(government)
        break
      }
      case 'ADMIN': {
        const admin = await Admin.findByPk(userData.id)
        userDto = new UserDto(admin)
        break
      }
      default: {
        throw ApiError.BadRequest('Некорректная роль')
      }
    }
    const tokens = tokenService.generateTokens({...userDto})

    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: userDto
    }
  }
}

module.exports = new AuthService()