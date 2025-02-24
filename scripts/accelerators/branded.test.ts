import * as zod from "zod";
import { ZodAccelerator } from "..";

describe("branded type", () => {
	it("input string", () => {
		const schema = zod.string().brand();
		const accelerateSchema = ZodAccelerator.build(schema);
		const data = "test";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));
	});
});
