const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	memoryStore 	= require("../../../../storage/lib/stores/memoryStore");

const constructorTest = (done) => {
	const instance = memoryStore();
	expect(instance.store).not.toBe(null);
	expect(instance.jsonpath).not.toBe(null);

	const anotherInstance = memoryStore("woot");
	expect(anotherInstance.jsonpath).toEqual("woot");
	done();
};

const fetchUnknownTest = (done) => {
	const instance = memoryStore();

	instance.getResources("doot", 1, 5).then((results) => {
		expect(results).toEqual([]);

		done();
	});
};

const fetchFiltersTest = (done) => {
	const instance = memoryStore();

	Promise.all([1,2,3,4,5,6,7,8,9].map((num) => {
		return instance.createResource("doot", num, {
			number : num
		});
	})).then(() => {
		instance.getResources("doot", 1, 5, [
				{
					path : "$.number",
					value : 1
				},
				{
					path : "$.number",
					value : 2
				},
				{
					path : "$.number",
					value : 3
				}
			]).then((results) => {
			expect(results).toEqual([
				{
					id : '1',
					number : 1
				},
				{
					id : '2',
					number : 2
				},
				{
					id : '3',
					number : 3
				}
			]);

			done();
		});
	})
};


const fetchTest = (done) => {
	const instance = memoryStore();

	Promise.all([1,2,3,4,5,6,7,8,9].map((num) => {
		return instance.createResource("doot", num, num);
	})).then(() => {
		instance.getResources("doot", 1, 5).then((results) => {
			expect(results).toEqual([1,2,3,4,5]);

			done();
		});
	})
};

const getDetailsNoParent = (done) => {
	const instance = memoryStore();

	Promise.all([1,2,3,4,5,6,7,8,9].map((num) => {
		return instance.createResource("woot", num, {
			parent : num % 2 === 0 ? 1 : 2,
			number : 1
		});
	})).then(() => {
		instance.getDetails("woot").then((details) => {
			expect(details.count).toEqual(9);

			done();
		});
	});
};

const getDetailsWithParent = (done) => {
	const instance = memoryStore();

	Promise.all([1,2,3,4,5,6,7,8,9].map((num) => {
		return instance.createResource("woot", num, {
			parent : num % 2 === 0 ? 1 : 2,
			number : 1
		});
	})).then(() => {
		instance.getDetails("woot", 1).then((details) => {
			expect(details.count).toEqual(4);

			done();
		});
	});
};

const getNotFound = (done) => {
	const instance = memoryStore();

	instance.getResource("doot", 1).then((resource) => {
		expect(resource).toBe(undefined);

		done();
	});
};

const getFound = (done) => {
	const instance = memoryStore();

	instance.createResource("doot", "id", "val").then(() => {
		instance.getResource("doot", "id").then((resource) => {
			expect(resource).toEqual("val");

			done();
		});
	});
};

const updateTest = (done) => {
	const instance = memoryStore();

	instance.createResource("doot", "id", "val").then(() => {
		return instance.getResource("doot", "id");
	}).then((resource) => {
		expect(resource).toEqual("val");

		return instance.updateResource("doot", "id", "not val");
	}).then(() => {
		return instance.getResource("doot", "id");
	}).then((resource) => {
		expect(resource).toEqual("not val");

		done();
	});
};

const deleteTest = (done) => {
	const instance = memoryStore();

	instance.createResource("doot", "id", "val").then(() => {
		return instance.getResource("doot", "id");
	}).then((resource) => {
		expect(resource).toEqual("val");

		return instance.deleteResource("doot", "id");
	}).then(() => {
		return instance.getResource("doot", "id");
	}).then((resource) => {
		expect(resource).toBe(undefined);

		done();
	});
};

describe("A memory storage service", () => {
	it("defaults its constructor arguments", constructorTest);

	describe("can get the details for a resource group", () => {
		it("without a parent", getDetailsNoParent);
		it("with a parent", getDetailsWithParent);
	});

	describe("can fetch resources", () => {
		it("handling unknown types", fetchUnknownTest);
		it("handling start and count params", fetchTest);
		it("handling filters", fetchFiltersTest);
	});

	describe("can fetch a resource", () => {
		it("handling not found", getNotFound);
		it("handling found", getFound);
	});

	it("can update a resource", updateTest);
	it("can delete a resource", deleteTest);
});