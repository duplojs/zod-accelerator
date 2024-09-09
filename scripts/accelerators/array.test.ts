import * as zod from "zod";
import { ZodAccelerator } from "..";
import { ZodAcceleratorError } from "@scripts/error";

describe("array type", () => {
	it("input string array", () => {
		const schema = zod.string().array();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = ["test", "test1", "test2"];

		expect(accelerateSchema.parse(data)).toEqual(schema.parse(data));

		data = ["test", 111, "test2"];

		try {
			accelerateSchema.parse(data);
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(".[Array 1] : Input is not a String.");
		}
	});

	it("input object array", () => {
		const schema = zod.array(zod.object({ test: zod.string() }));
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = [{ test: "test1" }, { test: "test1" }, { test: "test1" }];

		expect(accelerateSchema.parse(data)).toEqual(schema.parse(data));

		data = [{ test: "test1" }, { test: 111 }, { test: "test1" }];

		try {
			accelerateSchema.parse(data);
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(".[Array 1].test : Input is not a String.");
		}
	});

	it("check array length", () => {
		const schema = zod.array(zod.object({ test: zod.string() })).length(2);
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = [{ test: "test1" }, { test: "test1" }];

		expect(accelerateSchema.parse(data)).toEqual(schema.parse(data));

		data = [{ test: "test1" }, { test: "test1" }, { test: "test1" }];

		try {
			accelerateSchema.parse(data);
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input Array has length not equal to 2.");
		}
	});

	it("check array min length", () => {
		const schema = zod.array(zod.object({ test: zod.string() })).min(3);
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = [{ test: "test1" }, { test: "test1" }, { test: "test1" }];

		expect(accelerateSchema.parse(data)).toEqual(schema.parse(data));

		data = [{ test: "test1" }];

		try {
			accelerateSchema.parse(data);
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input Array has length less than 3.");
		}
	});

	it("check array max length", () => {
		const schema = zod.array(zod.object({ test: zod.string() })).max(3);
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = [{ test: "test1" }, { test: "test1" }, { test: "test1" }];

		expect(accelerateSchema.parse(data)).toEqual(schema.parse(data));

		data = [{ test: "test1" }, { test: "test1" }, { test: "test1" }, { test: "test1" }];

		try {
			accelerateSchema.parse(data);
			throw new Error();
		} catch (error: any) {
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input Array has length more than 3.");
		}
	});
});
