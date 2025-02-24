import * as zod from "zod";
import { ZodAccelerator } from "..";
import { ZodAcceleratorError } from "@scripts/error";

describe("union type", () => {
	it("input string", () => {
		const schema = zod.union([
			zod.string(),
			zod.number().array(),
			zod.object({
				test1: zod.string(),
			}),
			zod.bigint(),
			zod.number(),
			zod.boolean(),
			zod.string().brand("toto"),
			zod.date(),
			zod.string().default(""),
			zod.string().transform((value) => value),
			zod.enum(["toto"]),
			zod.string().and(zod.number()),
			zod.lazy(() => zod.string()),
			zod.literal(1),
			zod.never(),
			zod.null(),
			zod.string().nullable(),
			zod.string().optional(),
			zod.string().pipe(zod.string()),
			zod.object({ tt: zod.object({}).readonly() }).readonly(),
			zod.record(zod.string()),
			zod.symbol(),
			zod.tuple([zod.literal("toto")]),
			zod.undefined(),
			zod.void(),
			zod.union([zod.string(), zod.number()]),
		]);
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = "test";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = [11];

		expect(accelerateSchema.parse(data)).toStrictEqual(schema.parse(data));

		data = [];

		expect(accelerateSchema.parse(data)).toStrictEqual(schema.parse(data));

		data = { test1: "1" };

		expect(accelerateSchema.parse(data)).toStrictEqual(schema.parse(data));

		data = { test1: 1 };

		try {
			accelerateSchema.parse(data);
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.issues.at(0)!.message).toBe(". : Input has no correspondence in union.");
		}
	});
});
