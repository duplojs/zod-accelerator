import * as zod from "zod";
import {ZodAccelerator} from "../../scripts";

describe("readonly type", () => {
	it("input object", () => {
		const schema = zod.object({
			test1: zod.string(),
		}).readonly();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = {
			test1: "test",
			ddd: 1
		};

		const result = accelerateSchema.parse(data);
        
		expect(result).toStrictEqual(schema.parse(data));

		try {
			//@ts-ignore
			result.test1 = "";
			throw null;
		} catch (error: any){
			expect(error).instanceOf(TypeError);
		}
	});
});
