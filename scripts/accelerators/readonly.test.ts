import * as zod from "zod";
import { ZodAccelerator } from "..";

describe("readonly type", () => {
	it("input object", () => {
		const schema = zod.object({
			test1: zod.string(),
		}).readonly();
		const accelerateSchema = ZodAccelerator.build(schema);
		const data: any = {
			test1: "test",
			ddd: 1,
		};

		const result = accelerateSchema.parse(data);

		expect(result).toStrictEqual(schema.parse(data));

		try {
			//@ts-expect-error readonly error
			result.test1 = "";
			throw new Error();
		} catch (error: any) {
			expect(error).instanceOf(TypeError);
		}
	});
});
