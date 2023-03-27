const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    required: true,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    required: true,
  },
  lastname: {
    type: DataTypes.STRING
  },
  name: {
    type: DataTypes.STRING
  },
  patronymic: {
    type: DataTypes.STRING
  },
  number: {
    type: DataTypes.STRING
  },
  sex: {
    type: DataTypes.ENUM(' ', 'male', 'female')
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  activationLink: {
    type: DataTypes.STRING
  },
  department: {
    type: DataTypes.STRING
  },
  photo: {
    type: DataTypes.ARRAY(DataTypes.STRING)
  },
  quantityOfRequests: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isBanned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  authToken: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  chatId: {
    type: DataTypes.STRING,
    unique: true
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: "USER"
  }
})

const Government = sequelize.define('government', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    required: true,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    required: true,
  },
  lastname: {
    type: DataTypes.STRING
  },
  name: {
    type: DataTypes.STRING
  },
  patronymic: {
    type: DataTypes.STRING
  },
  number: {
    type: DataTypes.STRING
  },
  sex: {
    type: DataTypes.ENUM(' ', 'male', 'female')
  },
  isActivated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  activationLink: {
    type: DataTypes.STRING
  },
  quantityOfViolations: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isBanned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: "GOVERNMENT"
  }
})

const Admin = sequelize.define('admin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    required: true,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    required: true,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  activationLink: {
    type: DataTypes.STRING
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: "ADMIN"
  }
})

const Token = sequelize.define('token', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    required: true
  },
  refreshToken: {
    type: DataTypes.STRING(1000),
    allowNull: false,
    required: true
  }
})

const Violation = sequelize.define('violations', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  file: {
    type: DataTypes.ARRAY(DataTypes.STRING)
  },
  name: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.STRING
  },
  latitude: {
    type: DataTypes.DOUBLE
  },
  longitude: {
    type: DataTypes.DOUBLE
  },
  violationStatus: {
    type: DataTypes.ENUM('waiting', 'accepted', 'rejected'),
    defaultValue: 'waiting'
  },
})

const Departments = sequelize.define('departments', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING
  },
  latitudeOne: {
    type: DataTypes.DOUBLE
  },
  longitudeOne: {
    type: DataTypes.DOUBLE
  },
  latitudeTwo: {
    type: DataTypes.DOUBLE
  },
  longitudeTwo: {
    type: DataTypes.DOUBLE
  },
  latitudeThree: {
    type: DataTypes.DOUBLE
  },
  longitudeThree: {
    type: DataTypes.DOUBLE
  },
  latitudeFour: {
    type: DataTypes.DOUBLE
  },
  longitudeFour: {
    type: DataTypes.DOUBLE
  },
})

User.hasOne(Token)
Token.belongsTo(User)

Government.hasOne(Token)
Token.belongsTo(Government)

Admin.hasOne(Token)
Token.belongsTo(Admin)

User.hasOne(Violation)
Violation.belongsTo(User)

Departments.hasOne(Government)
Government.belongsTo(Departments)

module.exports = {
  User,
  Government,
  Token,
  Admin,
  Violation,
  Departments
}