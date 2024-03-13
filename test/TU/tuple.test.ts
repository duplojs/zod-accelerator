import * as zod from "zod";
import {ZodAccelerator} from "../../scripts";
import {ZodAcceleratorError} from "../../scripts/lib/error";

describe("tuple type", () => {
	it("tuple symbol", () => {
		const schema = zod.tuple([zod.string(), zod.number()]);
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = ["test", 11];

		expect(accelerateSchema.parse(data)).toStrictEqual(schema.parse(data));

		data = ["test", "11"];

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(".[Tuple 1] : Input is not a Number.");
		}
	});

	it("tuple symbol", () => {
		const schema = zod.tuple([zod.string(), zod.number()]).rest(zod.string());
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = ["test", 11];

		expect(accelerateSchema.parse(data)).toStrictEqual(schema.parse(data));

		data = ["test", 1, "eee"];

		expect(accelerateSchema.parse(data)).toStrictEqual(schema.parse(data));

		data = ["test", 11, 11];

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(".[Tuple Rest 2] : Input is not a String.");
		}
	});
});
