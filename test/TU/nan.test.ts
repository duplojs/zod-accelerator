import * as zod from "zod";
import {ZodAccelerator} from "../../scripts";
import {ZodAcceleratorError} from "../../scripts/lib/error";

describe("nan type", () => {
	it("input nan", () => {
		const schema = zod.nan();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = NaN;

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = 11;

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input is not NaN.");
		}
	});
});
