module.exports = class DepartmentsDto {
  id
  name
  latitudeOne
  longitudeOne
  latitudeTwo
  longitudeTwo
  latitudeThree
  longitudeThree
  latitudeFour
  longitudeFour

  constructor(model) {
    this.id = model.id
    this.name = model.name
    this.latitudeOne = model.latitudeOne
    this.longitudeOne = model.longitudeOne
    this.latitudeTwo = model.latitudeTwo
    this.longitudeTwo = model.longitudeTwo
    this.latitudeThree = model.latitudeThree
    this.longitudeThree = model.longitudeThree
    this.latitudeFour = model.latitudeFour
    this.longitudeFour = model.longitudeFour
  }
}