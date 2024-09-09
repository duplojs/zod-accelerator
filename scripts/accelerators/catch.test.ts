import * as zod from "zod";
import { ZodAccelerator } from "..";

describe("catch type", () => {
	it("input string", () => {
		const schema = zod.string().catch("nono");
		const accelerateSchema = ZodAccelerator.build(schema);
		const data = "test";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));
	});

	it("input object", () => {
		const schema = zod.string().catch("test");
		const accelerateSchema = ZodAccelerator.build(schema);
		const data = { test: "test" };

		expect(accelerateSchema.parse(data)).toEqual(schema.parse(data));
	});
});
