import * as zod from "zod";
import { ZodAccelerator, ZodAcceleratorError } from "..";

describe("lazy type", () => {
	it("input object", () => {
		interface Category {
			name: string;
			subcategories: Category[];
		}

		const schema: zod.ZodType<Category> = zod.object({
			name: zod.string(),
			subcategories: zod.lazy(() => schema.array()),
		});
		const accelerateSchema = ZodAccelerator.build(schema);

		let data: any = {
			name: "People",
			subcategories: [
				{
					name: "Politicians",
					subcategories: [
						{
							name: "Presidents",
							subcategories: [],
						},
					],
				},
			],
		};

		expect(accelerateSchema.parse(data)).toStrictEqual(schema.parse(data));

		data = {
			name: "People",
			subcategories: [
				{
					name: "Politicians",
					subcategories: [
						{
							name: "Presidents",
							subcategories: [],
						},
						{
							name: 1,
							subcategories: [],
						},
					],
				},
			],
		};

		try {
			accelerateSchema.parse(data);
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(".subcategories.[Array 0].subcategories.[Array 1].name : Input is not a String.");
		}
	});

	it("input string", () => {
		const schema = zod.lazy(() => zod.string());
		const accelerateSchema = ZodAccelerator.build(schema);

		let data: any = "teste";

		expect(accelerateSchema.parse(data)).toStrictEqual(schema.parse(data));

		data = 1;

		try {
			accelerateSchema.parse(data);
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input is not a String.");
		}
	});
});
