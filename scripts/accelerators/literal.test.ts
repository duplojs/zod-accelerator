import * as zod from "zod";
import { ZodAccelerator } from "..";
import { ZodAcceleratorError } from "@scripts/error";

describe("literal type", () => {
	it("input string", () => {
		const schema = zod.literal("test");
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = "test";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "tt";

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
					message: ". : Input literal is wrong.",
					path: [],
				},
			]);
		}
	});

	it("input number", () => {
		const schema = zod.literal(222);
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = 222;

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "tt";

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
					message: ". : Input literal is wrong.",
					path: [],
				},
			]);
		}
	});
});
