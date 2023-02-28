module.exports = class UserProfileDto {
  id
  name
  description
  violationStatus

  constructor(model) {
    this.id = model.id
    this.name = model.name
    this.description = model.description
    this.violationStatus = model.violationStatus

    if (model?.file) {
      this.file = this.#createFileObj(model.file)
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