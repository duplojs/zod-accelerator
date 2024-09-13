import * as zod from "zod";
import { ZodAccelerator } from "..";
import { ZodAcceleratorError } from "@scripts/error";

describe("effects type", () => {
	it("transform", () => {
		const schema = zod.string().transform((value, ctx) => {
			if (value === "") {
				ctx.addIssue({
					message: "super message",
					code: "custom",
				});
				return zod.NEVER;
			}

			return value.length;
		});
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = "test";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "";

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
					message: "super message",
					path: [],
				},
			]);
		}
	});

	it("refine", () => {
		const schema = zod.string().refine((value) => value !== "", { message: "super message" });
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = "test";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "";

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
					message: "super message",
					path: [],
				},
			]);
		}
	});

	it("superRefine", () => {
		const schema = zod.string().superRefine((value, ctx) => {
			if (value === "") {
				ctx.addIssue({
					message: "super message",
					code: "custom",
				});
				return zod.NEVER;
			}
		});
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = "test";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "";

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
					message: "super message",
					path: [],
				},
			]);
		}
	});

	it("preprocess", () => {
		const schema = zod.preprocess((value, ctx) => {
			if (value === "") {
				ctx.addIssue({
					message: "super message",
					code: "custom",
				});
				return zod.NEVER;
			}

			return String(value).valueOf();
		}, zod.string());
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = "test";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "";

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
					message: "super message",
					path: [],
				},
			]);
		}
	});
});
