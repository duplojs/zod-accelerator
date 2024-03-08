import * as zod from "zod";
import {ZodAccelerator} from "../../scripts";
import {ZodAcceleratorError} from "../../scripts/lib/error";

describe("bigInt type", () => {
	it("input bool", () => {
		const schema = zod.boolean();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = true;

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = {test: "test"};

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(err.message).toBe(". : ");
		}
	});

	it("coerce object", () => {
		const schema = zod.coerce.boolean();
		const accelerateSchema = ZodAccelerator.build(schema);
		const data = {test: "test"};

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));
	});
});
