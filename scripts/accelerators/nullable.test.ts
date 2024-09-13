import * as zod from "zod";
import { ZodAccelerator } from "..";
import { ZodAcceleratorError } from "@scripts/error";

describe("nullable type", () => {
	it("input string", () => {
		const schema = zod.string().nullable();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = "string";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = null;

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
					message: ". : Input is not a String.",
					path: [],
				},
			]);
		}
	});
});
