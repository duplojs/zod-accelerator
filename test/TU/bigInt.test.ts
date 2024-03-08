import * as zod from "zod";
import {ZodAccelerator} from "../../scripts";
import {ZodAcceleratorError} from "../../scripts/lib/error";

describe("bigInt type", () => {
	it("input BigInt", () => {
		const schema = zod.bigint();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = 3n;

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = {test: "test"};

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : ");
		}
	});

	it("check min BigInt", () => {
		const schema = zod.bigint().min(1n);
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = 3n;

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = 0n;

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : ");
		}
	});

	it("check max BigInt", () => {
		const schema = zod.bigint().max(4n);
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = 3n;

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = 5n;

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : ");
		}
	});

	it("check multipleOf BigInt", () => {
		const schema = zod.bigint().multipleOf(4n);
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = 8n;

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = 3n;

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : ");
		}
	});

	it("coerce string", () => {
		const schema = zod.coerce.bigint();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = "8";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "3n";

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			// expect(schema.safeParse(data).success).toBe(false)
			expect(err.message).toBe(". : ");
		}
	});
});
