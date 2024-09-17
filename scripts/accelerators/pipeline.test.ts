import * as zod from "zod";
import { ZodAccelerator, ZodAcceleratorError } from "..";

describe("pipeline type", () => {
	it("input string", () => {
		const schema = zod.string().pipe(zod.coerce.number());
		const accelerateSchema = ZodAccelerator.build(schema);
		const data: any = "2";

		const result = accelerateSchema.parse(data);

		expect(result).toStrictEqual(schema.parse(data));

		try {
			accelerateSchema.parse("TT");
			throw new Error();
		} catch (error: any) {
			expect(error).instanceOf(ZodAcceleratorError);
			expect(error.issues).toStrictEqual([
				{
					code: "custom",
					message: ". : Input is not a Number.",
					path: [],
				},
			]);
		}
	});
});
