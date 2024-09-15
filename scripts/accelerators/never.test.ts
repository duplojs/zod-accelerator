import * as zod from "zod";
import { ZodAccelerator } from "..";
import { ZodAcceleratorError } from "@scripts/error";

describe("never type", () => {
	it("input string", () => {
		const schema = zod.never();
		const accelerateSchema = ZodAccelerator.build(schema);
		const data = "";

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
					message: ". : Input is not never.",
					path: [],
				},
			]);
		}
	});
});
