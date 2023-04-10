module.exports = class ViolationsDto {
  id
  name
  description
  latitude
  longitude
  violationStatus
  isAcceptedClass
  garbageClass


  constructor(...model) {
    this.id = model[0].id
    this.name = model[0].name
    this.description = model[0].description
    this.latitude = model[0].latitude
    this.longitude = model[0].longitude
    this.violationStatus = model[0].violationStatus
    this.isAcceptedClass = model[0].isAcceptedClass
    this.file = model[0]?.file
    this.garbageClass = {
      id: model[1].id,
      name: model[1].name
    }
  }
}