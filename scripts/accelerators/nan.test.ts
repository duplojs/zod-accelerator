import * as zod from "zod";
import { ZodAccelerator } from "..";
import { ZodAcceleratorError } from "@scripts/error";

describe("nan type", () => {
	it("input nan", () => {
		const schema = zod.nan();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = NaN;

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
					message: ". : Input is not NaN.",
					path: [],
				},
			]);
		}
	});
});
