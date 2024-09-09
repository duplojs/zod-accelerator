import * as zod from "zod";
import { ZodAccelerator } from "..";
import { ZodAcceleratorError } from "@scripts/error";

describe("default type", () => {
	it("input string", () => {
		const schema = zod.string().default("nono");
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = "test";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = null;

		try {
			accelerateSchema.parse(data);
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input is not a String.");
		}
	});

	it("input undefined", () => {
		const schema = zod.string().default("nono");
		const accelerateSchema = ZodAccelerator.build(schema);
		const data = undefined;

		expect(accelerateSchema.parse(data)).toEqual(schema.parse(data));
	});
});
