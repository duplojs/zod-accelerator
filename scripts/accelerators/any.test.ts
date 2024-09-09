import * as zod from "zod";
import { ZodAccelerator } from "..";

describe("any type", () => {
	it("input string", () => {
		const schema = zod.any();
		const accelerateSchema = ZodAccelerator.build(schema);
		const data = "test";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));
	});

	it("input object", () => {
		const schema = zod.any();
		const accelerateSchema = ZodAccelerator.build(schema);
		const data = { test: "test" };

		expect(accelerateSchema.parse(data)).toEqual(schema.parse(data));
	});
});
