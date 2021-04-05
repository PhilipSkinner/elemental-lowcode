const
	jasmine 			= require("jasmine"),
	environmentService 	= require("../../shared/environmentService");

const varTest = () => {
	const instance = environmentService();

	process.env["WOOT"] = "DOOT";

	expect(instance.getEnvironmentVariable("WOOT")).toEqual("DOOT");
};

const listTest = () => {
	const instance = environmentService();

	process.env["WOOT"] = "DOOT";
	process.env["ELEMENTAL__ENV__SUPER_SECRET"] = "hello there";

	const results = instance.listEnvironmentVariables();

	expect(results["WOOT"]).toEqual("DOOT");
	expect(results["ELEMENTAL__ENV__SUPER_SECRET"]).toBe(undefined);
};

const secretVarTest = () => {
	const instance = environmentService();

	process.env["ELEMENTAL__ENV__SUPER_SECRET"] = "hello there";

	expect(instance.getSecret("SUPER_SECRET")).toEqual("hello there");
};

const listSecretTest = () => {
	const instance = environmentService();

	process.env["WOOT"] = "DOOT";
	process.env["ELEMENTAL__ENV__SUPER_SECRET"] = "hello there";

	const results = instance.listSecrets();

	expect(results["WOOT"]).toBe(undefined);
	expect(results["SUPER_SECRET"]).toEqual("hello there");
};

describe("An environmental variables service", () => {
	it("can get an environmental variable", varTest);
	it("can get all environmental variables", listTest);
	it("can get a secret environmental variable", secretVarTest);
	it("can list all secret environmental variables", listSecretTest);
});