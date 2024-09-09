import * as zod from "zod";
import { ZodAccelerator } from "..";
import { ZodAcceleratorError } from "@scripts/error";

describe("bigInt type", () => {
	it("input bool", () => {
		const schema = zod.boolean();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = true;

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = { test: "test" };

		try {
			accelerateSchema.parse(data);
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(err.message).toBe(". : Input is not boolean.");
		}
	});

	it("coerce object", () => {
		const schema = zod.coerce.boolean();
		const accelerateSchema = ZodAccelerator.build(schema);
		const data = { test: "test" };

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));
	});
});
