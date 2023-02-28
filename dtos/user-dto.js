module.exports = class UserDto {
  email
  role
  id
  departmentId
  isActivated
  isBanned

  constructor(model) {
    this.email = model.email
    this.role = model.role
    this.id = model.id
    this.departmentId = model.departmentId
    this.isActivated = model.isActivated
    this.isBanned = model.isBanned
  }
}