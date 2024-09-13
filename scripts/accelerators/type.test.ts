
import * as zod from "zod";
import { ZodAccelerator } from "..";
import { ZodAcceleratorError } from "@scripts/error";

describe("type", () => {
	it("create parser for missing Map", () => {
		const schema = zod.map(zod.string(), zod.string());
		const accelerateSchema = ZodAccelerator.build(schema);
		const data = new Map();
		data.set("toto", "tata");

		expect(accelerateSchema.parse(data)).toStrictEqual(schema.parse(data));

		data.set("tata", 2);

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
					message: ". : ZodSchema Fail parse.",
					path: [],
				},
			]);
		}
	});
});
