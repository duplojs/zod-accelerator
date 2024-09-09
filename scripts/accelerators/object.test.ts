import * as zod from "zod";
import { ZodAccelerator } from "..";
import { ZodAcceleratorError } from "@scripts/error";

describe("object type", () => {
	it("input object", () => {
		const schema = zod.object({
			test1: zod.string(),
			ddd: zod.number().optional(),
		});
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = {
			test1: "test",
			ddd: 1,
			toto: 2,
		};

		expect(accelerateSchema.parse(data)).toStrictEqual(schema.parse(data));

		data = {
			test1: "ettet",
		};

		expect(accelerateSchema.parse(data)).toStrictEqual(schema.parse(data));

		data = {};

		try {
			accelerateSchema.parse(data);
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(".test1 : Input is not a String.");
		}

		data = 11;

		try {
			accelerateSchema.parse(data);
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input is not Object.");
		}
	});

	it("input strict object", () => {
		const schema = zod.object({
			test1: zod.string(),
			ddd: zod.number().optional(),
		}).strict();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = {
			test1: "test",
			ddd: 1,
		};

		expect(accelerateSchema.parse(data)).toStrictEqual(schema.parse(data));

		data = {
			test1: "test",
			test2: "test",
		};

		try {
			accelerateSchema.parse(data);
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(".test2 : Input Object has key to many.");
		}
	});

	it("input passthrough object", () => {
		const schema = zod.object({
			test1: zod.string(),
			ddd: zod.number().optional(),
		}).passthrough();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = {
			test1: "test",
			ddd: 1,
		};

		expect(accelerateSchema.parse(data)).toStrictEqual(schema.parse(data));

		data = {
			test1: "test",
			test2: "test",
		};

		expect(accelerateSchema.parse(data)).toStrictEqual(schema.parse(data));
	});

	it("input deep object", () => {
		const schema = zod.object({
			test1: zod.string(),
			ddd: zod.object({
				test2: zod.number(),
			}).strict(),
		});
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = {
			test1: "test",
			ddd: {
				test2: 2,
			},
		};

		expect(accelerateSchema.parse(data)).toStrictEqual(schema.parse(data));

		data = {
			test1: "test",
			ddd: {
				test2: "2",
			},
		};

		try {
			accelerateSchema.parse(data);
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(".ddd.test2 : Input is not a Number.");
		}

		data = {
			test1: "test",
			ddd: {
				test2: 2,
				test3: "ee",
			},
		};

		try {
			accelerateSchema.parse(data);
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(".ddd.test3 : Input Object has key to many.");
		}
	});
});
