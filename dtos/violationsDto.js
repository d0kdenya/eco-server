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
    console.log('model[0]: ', model[0].violations)
    console.log('model[0]: ', model[0].dataValues)
    console.log('model[0]: ', model[0].violations.dataValues)
    console.log('model[1]: ', model[1])
    this.id = model[0].id
    this.name = model[0].name
    this.description = model[0].description
    this.latitude = model[0].latitude
    this.longitude = model[0].longitude
    this.violationStatus = model[0].violationStatus
    this.isAcceptedClass = model[0].isAcceptedClass
    this.file = model[0]?.file
    this.garbageClass = {
      garbageClassId: model[1].garbageClassId,
      garbageClassName: model[1].garbageClassName
    }
  }
}