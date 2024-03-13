import * as zod from "zod";
import {ZodAccelerator} from "../../scripts";
import {ZodAcceleratorError} from "../../scripts/lib/error";

describe("never type", () => {
	it("input string", () => {
		const schema = zod.never();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = "";

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input is not never.");
		}
	});
});
