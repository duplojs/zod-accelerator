import * as zod from "zod";
import {ZodAccelerator} from "../../scripts";
import {ZodAcceleratorError} from "../../scripts/lib/error";

describe("string type", () => {
	it("input string", () => {
		const schema = zod.string();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data: any = "test";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = 12;

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input is not a String.");
		}
	});

	it("check min length string", () => {
		const schema = zod.string().min(2);
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = "test";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "t";

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input String has length less than 2.");
		}
	});

	it("check max length string", () => {
		const schema = zod.string().max(2);
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = "te";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "tee";

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input String has length more than 2.");
		}
	});

	it("check length string", () => {
		const schema = zod.string().length(2);
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = "te";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "t";

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input String has length not equal to 2.");
		}
	});

	it("check email string", () => {
		const schema = zod.string().email();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = "campani.mathieu@gmail.com";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "t";

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input string is not an Email.");
		}
	});

	it("check url string", () => {
		const schema = zod.string().url();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = "https://campani.fr";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "t";

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input String is not an url.");
		}
	});

	it("check emoji string", () => {
		const schema = zod.string().emoji();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = "🤓";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "t";

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input String is not an emoji.");
		}
	});

	it("check uuid string", () => {
		const schema = zod.string().uuid();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = "123e4567-e89b-12d3-a456-426614174000";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "t";

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input String is not an uuid.");
		}
	});

	it("check cuid string", () => {
		const schema = zod.string().cuid();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = "cjld2cjxh0000qzrmn831i7rn";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "t";

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input String is not an cuid.");
		}
	});

	it("check cuid2 string", () => {
		const schema = zod.string().cuid2();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = "tz4a98xxat96iws9zmbrgj3a";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "2";

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input String is not an cuid2.");
		}
	});

	it("check includes string", () => {
		const schema = zod.string().includes("test");
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = "test";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "2";

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input String not includes test.");
		}
	});

	it("check ulid string", () => {
		const schema = zod.string().ulid();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = "01AN4Z07BY79KA1307SR9X4MV3";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "2";

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input String is not an ulid.");
		}
	});

	it("check startsWith string", () => {
		const schema = zod.string().startsWith("test");
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = "test fff";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "2";

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input String not starts with test.");
		}
	});

	it("check endsWith string", () => {
		const schema = zod.string().endsWith("test");
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = "fff test";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "2";

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input String not ends with test.");
		}
	});

	it("check regex string", () => {
		const schema = zod.string().regex(/test/);
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = "fff test";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "2";

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input String not match with regex test.");
		}
	});

	it("check trim string", () => {
		const schema = zod.string().trim();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = "  fff test   ";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));
	});

	it("check toUpperCase string", () => {
		const schema = zod.string().toUpperCase();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = "  fff test   ";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));
	});

	it("check toLowerCase string", () => {
		const schema = zod.string().toLowerCase();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = "  fff tAAAt   ";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));
	});

	it("check datetime string", () => {
		const schema = zod.string().datetime();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = "1970-01-01T00:00:00.000Z";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "2";

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input String is not a datetime.");
		}
	});

	it("check datetime p0 string", () => {
		const schema = zod.string().datetime({precision: 0});
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = "1970-01-01T00:00:00Z";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "2";

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input String is not a datetime.");
		}
	});

	it("check datetime p3 string", () => {
		const schema = zod.string().datetime({precision: 3});
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = "1970-01-01T00:00:00.000Z";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "2";

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input String is not a datetime.");
		}
	});

	it("check offset true string", () => {
		const schema = zod.string().datetime({offset: true});
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = "1970-01-01T00:00:00.000Z";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "2";

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input String is not a datetime.");
		}
	});

	it("check datetime p4 offset true string", () => {
		const schema = zod.string().datetime({offset: true, precision: 4});
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = "1970-01-01T00:00:00.1234Z";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "2";

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input String is not a datetime.");
		}
	});

	it("check datetime p0 offset true string", () => {
		const schema = zod.string().datetime({offset: true, precision: 0});
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = "1970-01-01T00:00:00Z";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "2";

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input String is not a datetime.");
		}
	});

	it("check ip string", () => {
		const schema = zod.string().ip();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = "114.71.82.94";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "1e5e:e6c8:daac:514b:114b:e360:d8c0:682c";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "2";

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input String is not an ipv4 or ipv6.");
		}
	});

	it("check ipv4 string", () => {
		const schema = zod.string().ip({version: "v4"});
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = "114.71.82.94";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "2";

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input String is not an ipv4.");
		}
	});

	it("check ipv6 string", () => {
		const schema = zod.string().ip({version: "v6"});
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = "1e5e:e6c8:daac:514b:114b:e360:d8c0:682c";

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));

		data = "2";

		try {
			accelerateSchema.parse(data);
			throw null;
		} catch (error: any){
			const err: ZodAcceleratorError = error;
			expect(err).instanceOf(ZodAcceleratorError);
			expect(schema.safeParse(data).success).toBe(false);
			expect(err.message).toBe(". : Input String is not an ipv6.");
		}
	});

	it("coerce string", () => {
		const schema = zod.coerce.string();
		const accelerateSchema = ZodAccelerator.build(schema);
		let data = {};

		expect(accelerateSchema.parse(data)).toBe(schema.parse(data));
	});
});
