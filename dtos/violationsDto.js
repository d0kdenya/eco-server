module.exports = class ViolationsDto {
  id
  name
  description
  latitude
  longitude
  violationStatus
  garbageClass


  constructor(...model) {
    this.id = model[0].id
    this.name = model[0].name
    this.description = model[0].description
    this.latitude = model[0].latitude
    this.longitude = model[0].longitude
    this.violationStatus = model[0].violationStatus
    this.file = model[0]?.file
    this.garbageClass = {
      garbageClassId: model[1].garbageClassId,
      garbageClassName: model[1].garbageClassName
    }
  }
}