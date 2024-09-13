import * as zod from "zod";
import { ZodAccelerator } from "..";
import { ZodAcceleratorError } from "@scripts/error";

describe("date type", () => {
	it("input date", () => {
		const schema = zod.date();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = new Date();

		expect(accelerateSchema.parse(data)).toStrictEqual(schema.parse(data));

		data = { test: "test" };

		try {
			accelerateSchema.parse(data);
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(schema.safeParse(data).success).toBe(false);
			expect(err).instanceOf(ZodAcceleratorError);
			expect(err.issues).toStrictEqual([
				{
					code: "custom",
					message: ". : Input is invalide Date.",
					path: [],
				},
			]);
		}
	});

	it("check min date", () => {
		const minDate = new Date();
		minDate.setDate(minDate.getDate() - 1);

		let schema = zod.date().min(minDate);
		let accelerateSchema = ZodAccelerator.build(schema);
		const data = new Date();

		expect(accelerateSchema.parse(data)).toStrictEqual(schema.parse(data));

		minDate.setDate(minDate.getDate() + 2);
		schema = zod.date().min(minDate);
		accelerateSchema = ZodAccelerator.build(schema);

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
					message: `. : Input Date is less than ${minDate.getTime()}.`,
					path: [],
				},
			]);
		}
	});

	it("check max date", () => {
		const minDate = new Date();
		minDate.setDate(minDate.getDate() + 1);

		let schema = zod.date().max(minDate);
		let accelerateSchema = ZodAccelerator.build(schema);
		const data = new Date();

		expect(accelerateSchema.parse(data)).toStrictEqual(schema.parse(data));

		minDate.setDate(minDate.getDate() - 2);
		schema = zod.date().max(minDate);
		accelerateSchema = ZodAccelerator.build(schema);

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
					message: `. : Input Date is more than ${minDate.getTime()}.`,
					path: [],
				},
			]);
		}
	});

	it("coerce date", () => {
		const schema = zod.coerce.date();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = "2024-01-01";

		expect(accelerateSchema.parse(data)).toStrictEqual(schema.parse(data));

		data = { test: "test" };

		try {
			accelerateSchema.parse(data);
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(schema.safeParse(data).success).toBe(false);
			expect(err).instanceOf(ZodAcceleratorError);
			expect(err.issues).toStrictEqual([
				{
					code: "custom",
					message: ". : Input is invalide Date.",
					path: [],
				},
			]);
		}
	});
});
