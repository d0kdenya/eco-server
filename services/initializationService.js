const { GarbageClass } = require('../models/models')
class InitializationService {
	async initializeGarbageClass() {
		const classes = await GarbageClass.findAndCountAll()

		if (classes.count !== 4) {
			await GarbageClass.destroy({ truncate: { cascade: true } })

			await GarbageClass.create({ name: 'Household Garbage' })
			await GarbageClass.create({ name: 'Special Expenses' })
			await GarbageClass.create({ name: 'Industrial Waste' })
			await GarbageClass.create({ name: 'Other' })
		}
	}
}
module.exports = new InitializationService()
