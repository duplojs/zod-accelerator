import * as zod from "zod";
import { ZodAccelerator } from "..";
import { ZodAcceleratorError } from "@scripts/error";

describe("intersection type", () => {
	it("input string", () => {
		const schema = zod.intersection(
			zod.string().min(10),
			zod.string().max(15),
		);
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = "1123456789";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "tt";

		try {
			accelerateSchema.parse(data);
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input String has length less than 10.");
		}
	});

	it("input deep object", () => {
		const schema = zod.object({ test1: zod.string().array() })
			.and(zod.object({ test1: zod.string().array() }))
			.and(zod.object({
				test3: zod.object({
					test4: zod.string(),
				}),
			}))
			.and(zod.object({
				test3: zod.object({
					test5: zod.string(),
				}),
			}));

		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = {
			test1: ["test"],
			test3: {
				test4: "test",
				test5: "test",
			},
		};

		expect(accelerateSchema.parse(data)).toStrictEqual(schema.parse(data));

		data = {
			test1: ["eee"],
			test2: 222,
			test3: "333",
		};

		try {
			accelerateSchema.parse(data);
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(".test3 : Input is not Object.");
		}
	});

	it("input error array and date", () => {
		const date1 = new Date();
		const date2 = new Date(date1);

		const schema = zod.object({
			test1: zod.string().array()
				.optional(),
		})
			.and(zod.object({
				test1: zod.string().array()
					.transform((value) => ["test", ...value])
					.optional(),
			}))
			.and(zod.object({ test2: zod.string().optional() }))
			.and(zod.object({ test2: zod.coerce.number().optional() }))
			.and(zod.object({ test6: zod.date().default(date1) }))
			.and(zod.object({ test6: zod.date().default(date2) }))
			.and(zod.object({
				test7: zod.coerce.number().array()
					.optional(),
			}))
			.and(zod.object({
				test7: zod.string().array()
					.optional(),
			}));

		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = {
			test1: ["eee"],
		};

		try {
			accelerateSchema.parse(data);
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Intersection results could not be merged.");
		}

		data = {
			test7: ["12"],
		};

		try {
			accelerateSchema.parse(data);
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Intersection results could not be merged.");
		}

		data = {
			test2: "111",
		};

		try {
			accelerateSchema.parse(data);
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Intersection results could not be merged.");
		}

		data = {};

		expect(accelerateSchema.parse(data)).toStrictEqual(schema.parse(data));
	});
});
