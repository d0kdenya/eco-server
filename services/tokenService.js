const {Token} = require('../models/models')
const jwt = require('jsonwebtoken')

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {expiresIn: '1d'})
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {expiresIn: '30d'})

    return {
      accessToken,
      refreshToken
    }
  }

  validateAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_KEY)
    } catch (e) {
      return null
    }
  }

  validateRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_KEY)
    } catch (e) {
      return null
    }
  }

  async saveToken(userId, refreshToken, role) {
    switch (role) {
      case 'USER': {
        const tokenData = await Token.findOne({where: {userId}})

        if (tokenData) {
          return await Token.update({refreshToken}, {where: {userId}})
        }
        return await Token.create({refreshToken, userId})
      }
      case 'GOVERNMENT': {
        const tokenData = await Token.findOne({where: {governmentId: userId}})

        if (tokenData) {
          return await Token.update({refreshToken}, {where: {governmentId: userId}})
        }
        return await Token.create({refreshToken, governmentId: userId})
      }
      case 'ADMIN': {
        const tokenData = await Token.findOne({where: {adminId: userId}})

        if (tokenData) {
          return await Token.update({refreshToken}, {where: {adminId: userId}})
        }
        return await Token.create({refreshToken, adminId: userId})
      }
    }
  }

  async removeToken(refreshToken) {
    return await Token.destroy({where: {refreshToken}})
  }

  async findToken(refreshToken) {
    return await Token.findOne({where: {refreshToken}})
  }
}

module.exports = new TokenService()