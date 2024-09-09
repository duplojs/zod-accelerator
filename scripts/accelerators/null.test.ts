import * as zod from "zod";
import { ZodAccelerator } from "..";
import { ZodAcceleratorError } from "@scripts/error";

describe("null type", () => {
	it("input null", () => {
		const schema = zod.null();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = null;

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = 11;

		try {
			accelerateSchema.parse(data);
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input is not null.");
		}
	});
});
