const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	memoryStore 	= require("../../../../storage/lib/stores/memoryStore");

const constructorTest = (done) => {
	const instance = memoryStore();
	expect(instance.store).not.toBe(null);
	done();
};

const fetchUnknownTest = (done) => {
	const instance = memoryStore();

	instance.getResources("doot", 1, 5).then((results) => {
		expect(results).toEqual([]);

		done();
	});
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

	describe("can fetch resources", () => {
		it("handling unknown types", fetchUnknownTest);
		it("handling start and count params", fetchTest);
	});

	describe("can fetch a resource", () => {
		it("handling not found", getNotFound);
		it("handling found", getFound);
	});

	it("can update a resource", updateTest);
	it("can delete a resource", deleteTest);
});