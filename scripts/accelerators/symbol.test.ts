import * as zod from "zod";
import { ZodAccelerator } from "..";
import { ZodAcceleratorError } from "@scripts/error";

describe("symbol type", () => {
	it("input symbol", () => {
		const schema = zod.symbol();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = Symbol("data");

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = 11;

		try {
			accelerateSchema.parse(data);
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.issues).toStrictEqual([
				{
					code: "custom",
					message: ". : Input is not a Symbol.",
					path: [],
				},
			]);
		}
	});
});
