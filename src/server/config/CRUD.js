import { model } from "mongoose";

class CRUD {
	async create(model, data = {}) {
		try {
			if (checkDuplicates(model, data)) {
				throw new Error(
					"Duplicate entry added to model, aborted: ",
					data
				);
			}

			let doc;

			if (!Array.isArray(date)) {
				doc = await model.create(data);
			} else {
				doc = await model.createMany(data);
			}

			return {
				success: true,
			};
		} catch (error) {
			console.error("Error creating document");
			return {
				success: false,
				error: error,
			};
		}
	}

	async checkDuplicates(model, newEntry) {
		let result;
		if (!Array.isArray(newEntry)) {
			result = await model.findOne(newEntry);
		} else {
			const duplicateChecks = newEntry.map((entry) => {
				model.findOne(entry);
			});

			result = await Promise.all(duplicateChecks);
		}
		if (result) return true;
		else return false;
	}
}

export default CRUD;
