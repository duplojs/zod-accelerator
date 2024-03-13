import * as zod from "zod";
import {ZodAccelerator} from "../../scripts";
import {ZodAcceleratorError} from "../../scripts/lib/error";

describe("union type", () => {
	it("input string", () => {
		const schema = zod.union([
			zod.string(), 
			zod.number().array(),
			zod.object({
				test1: zod.string()
			})
		]);
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = "test";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = [11];

		expect(accelerateSchema.parse(data)).toStrictEqual(schema.parse(data));

		data = [];

		expect(accelerateSchema.parse(data)).toStrictEqual(schema.parse(data));

		data = {test1: "1"};

		expect(accelerateSchema.parse(data)).toStrictEqual(schema.parse(data));

		data = {test1: 1};

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input has no correspondence in union.");
		}
	});
});
