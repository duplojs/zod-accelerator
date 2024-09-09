import * as zod from "zod";
import { ZodAccelerator } from "..";
import { ZodAcceleratorError } from "@scripts/error";

describe("number type", () => {
	it("input number", () => {
		const schema = zod.number();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = 11;

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "";

		try {
			accelerateSchema.parse(data);
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input is not a Number.");
		}
	});

	it("check min number", () => {
		const schema = zod.number().min(1);
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = 3;

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = 0;

		try {
			accelerateSchema.parse(data);
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input Number is less than 1.");
		}
	});

	it("check max number", () => {
		const schema = zod.number().max(1);
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = 1;

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = 3;

		try {
			accelerateSchema.parse(data);
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input Number is more than 1.");
		}
	});

	it("check multipleOf number", () => {
		const schema = zod.number().multipleOf(4);
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = 8;

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = 3;

		try {
			accelerateSchema.parse(data);
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input Number is not multiple of 4.");
		}
	});

	it("check int number", () => {
		const schema = zod.number().int();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = 8;

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = 3.8;

		try {
			accelerateSchema.parse(data);
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input is not Int.");
		}
	});

	it("check finit number", () => {
		const schema = zod.number().finite();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = 8;

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = Infinity;

		try {
			accelerateSchema.parse(data);
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input Number is not finite.");
		}
	});

	it("coerce string", () => {
		const schema = zod.coerce.number();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = "8";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "test";

		try {
			accelerateSchema.parse(data);
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input is not a Number.");
		}
	});
});
