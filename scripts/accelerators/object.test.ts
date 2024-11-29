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
			expect(err.issues).toStrictEqual([
				{
					code: "custom",
					message: ".test1 : Input is not a String.",
					path: ["test1"],
				},
			]);
		}

		data = 11;

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
					message: ". : Input is not Object.",
					path: [],
				},
			]);
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
			expect(err.issues).toStrictEqual([
				{
					code: "custom",
					message: ".test2 : Input Object has key to many.",
					path: ["test2"],
				},
			]);
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
			expect(err.issues).toStrictEqual([
				{
					code: "custom",
					message: ".ddd.test2 : Input is not a Number.",
					path: ["ddd", "test2"],
				},
			]);
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
			expect(err.issues).toStrictEqual([
				{
					code: "custom",
					message: ".ddd.test3 : Input Object has key to many.",
					path: ["ddd", "test3"],
				},
			]);
		}
	});
	it("input merged object", () => {
		const schemaA = zod.object({ test1: zod.string() });

		const schemaB = zod.object({ test2: zod.number() });

		const schema = schemaA.merge(schemaB).strict();

		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = {
			test1: "test",
			test2: 1,
		};

		expect(accelerateSchema.parse(data)).toStrictEqual(schema.parse(data));

		data = {
			test1: "test",
		};

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
					message: ".test2 : Input is not a Number.",
					path: ["test2"],
				},
			]);
		}

		data = {
			test1: "test",
			test2: 1,
			test3: 1,
		};

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
					message: ".test3 : Input Object has key to many.",
					path: ["test3"],
				},
			]);
		}
	});
});
