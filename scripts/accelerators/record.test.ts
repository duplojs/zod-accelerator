import * as zod from "zod";
import { ZodAccelerator } from "..";
import { ZodAcceleratorError } from "@scripts/error";

describe("record type", () => {
	it("input record string string", () => {
		const schema = zod.record(zod.string());
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = {
			test1: "test",
			ddd: "test",
		};

		expect(accelerateSchema.parse(data)).toStrictEqual(schema.parse(data));

		data = {
			test1: 1,
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
					message: ".[Record Value \"test1\"] : Input is not a String.",
					path: ["[Record Value \"test1\"]"],
				},
			]);
		}
	});
});
