module.exports = class UserProfileDto {
  id
  email
  lastname
  name
  patronymic
  number
  sex
  department
  quantityOfRequests
  isBanned
  role

  constructor(model) {
    this.id = model.id
    this.email = model.email
    this.lastname = model.lastname
    this.name = model.name
    this.patronymic = model.patronymic
    this.number = model.number
    this.sex = model.sex
    this.department = model.department
    this.quantityOfRequests = model.quantityOfRequests
    this.isBanned = model.isBanned
    this.role = model.role

    if (model?.photo) {
      this.photo = this.#createFileObj(model.photo)
    }
  }

  #createFileObj(files) {
    let obj = {}
    files.forEach((file, iter) => {
      const originalName = file.split('-')
      obj[iter] = {
        "name": originalName[originalName.length - 1],
        "link": file
      }
    })
    return obj
  }
}