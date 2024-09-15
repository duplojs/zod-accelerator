import * as zod from "zod";
import { ZodAccelerator } from "..";
import { ZodAcceleratorError } from "@scripts/error";

describe("bigInt type", () => {
	it("input BigInt", () => {
		const schema = zod.bigint();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = 3n;

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = { test: "test" };

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
					message: ". : Input is not BigInt.",
					path: [],
				},
			]);
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
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.issues).toStrictEqual([
				{
					code: "custom",
					message: ". : Input BigInt is less or equal than 1.",
					path: [],
				},
			]);
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
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.issues).toStrictEqual([
				{
					code: "custom",
					message: ". : Input BigInt is more or equal than 4.",
					path: [],
				},
			]);
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
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.issues).toStrictEqual([
				{
					code: "custom",
					message: ". : Input BigInt is not multiple of 4.",
					path: [],
				},
			]);
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
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(err.issues).toStrictEqual([
				{
					code: "custom",
					message: ". : Input is not BigInt.",
					path: [],
				},
			]);
		}
	});
});
