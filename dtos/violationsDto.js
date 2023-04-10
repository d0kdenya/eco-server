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
    this.id = model[0].dataValues.id
    this.name = model[0].dataValues.name
    this.description = model[0].dataValues.description
    this.latitude = model[0].dataValues.latitude
    this.longitude = model[0].dataValues.longitude
    this.violationStatus = model[0].dataValues.violationStatus
    this.isAcceptedClass = model[0].dataValues.isAcceptedClass
    this.file = model[0].dataValues?.file
    this.garbageClass = {
      garbageClassId: model[1].dataValues.garbageClassId,
      garbageClassName: model[1].dataValues.garbageClassName
    }
  }
}