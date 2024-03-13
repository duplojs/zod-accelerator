import * as zod from "zod";
import {ZodAccelerator} from "../../scripts";
import {ZodAcceleratorError} from "../../scripts/lib/error";

describe("record type", () => {
	it("input record string string", () => {
		const schema = zod.record(zod.string());
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = {
			test1: "test",
			ddd: "test"
		};
        
		expect(accelerateSchema.parse(data)).toStrictEqual(schema.parse(data));

		data = {
			test1: 1
		};

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(".[Record Value \"test1\"] : Input is not a String.");
		}
	});

	it("input record number string", () => {
		const schema = zod.record(zod.number(), zod.string());
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = {
			1: "test",
			2: "test"
		};
        
		expect(accelerateSchema.parse(data)).toStrictEqual(schema.parse(data));

		data = {
			test1: 1
		};

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(".[Record Key \"test1\"] : Input is not a Number.");
		}
	});
});
