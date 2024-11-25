import * as zod from "zod";
import { zodSchemaIsAsync } from "./zodSchemaIsAsync";

describe("zodSchemaIsAsync", () => {
	it("array", () => {
		expect(
			zodSchemaIsAsync(
				zod.string().array(),
			),
		).toBe(false);

		expect(
			zodSchemaIsAsync(
				zod.string().transform(async() => {
					await Promise.resolve();
				})
					.array(),
			),
		).toBe(true);
	});

	it("catch", () => {
		expect(
			zodSchemaIsAsync(
				zod.string().catch(""),
			),
		).toBe(false);

		expect(
			zodSchemaIsAsync(
				zod.string().transform(async() => {
					await Promise.resolve();
				})
					.catch(undefined),
			),
		).toBe(true);
	});

	it("default", () => {
		expect(
			zodSchemaIsAsync(
				zod.string().default(""),
			),
		).toBe(false);

		expect(
			zodSchemaIsAsync(
				zod.string().transform(async() => {
					await Promise.resolve();
				})
					.default(""),
			),
		).toBe(true);
	});

	it("effect", async() => {
		expect(
			zodSchemaIsAsync(
				zod.preprocess(() => 12, zod.number()),
			),
		).toBe(false);

		expect(
			zodSchemaIsAsync(
				zod.string().transform(async() => {
					await Promise.resolve();
				}),
			),
		).toBe(true);

		expect(
			zodSchemaIsAsync(
				zod.string().refine(async() => {
					await Promise.resolve();
				}),
			),
		).toBe(true);

		expect(
			zodSchemaIsAsync(
				zod.string().superRefine(async() => {
					await Promise.resolve();
				}),
			),
		).toBe(true);

		expect(
			zodSchemaIsAsync(
				zod.string()
					.transform(async() => {
						await Promise.resolve();
					})
					.superRefine(() => void undefined),
			),
		).toBe(true);

		expect(
			zodSchemaIsAsync(
				zod.string().superRefine((val: any) => {
					val.tot = val;
					expect(val.ttt).toBe(val);
					expect(new val()).toBe(val);
					expect(val()).toBe(val);

					return Promise.resolve();
				}),
			),
		).toBe(true);

		expect(
			zodSchemaIsAsync(
				zod.string().superRefine((val: any) => {
					throw new Error();
				}),
			),
		).toBe(false);

		const result = zodSchemaIsAsync(
			zod.string().superRefine((val: any) => Promise.reject(new Error())),
		);

		await new Promise((res) => void setTimeout(res, 10));

		expect(result).toBe(true);
	});

	it("intersection", () => {
		expect(
			zodSchemaIsAsync(
				zod.string().and(zod.number()),
			),
		).toBe(false);

		expect(
			zodSchemaIsAsync(
				zod.string().transform(async() => {
					await Promise.resolve();
				})
					.and(zod.number()),
			),
		).toBe(true);
	});

	it("lazy", () => {
		expect(
			zodSchemaIsAsync(
				zod.lazy(() => zod.string().transform(() => 12)),
			),
		).toBe(false);

		expect(
			zodSchemaIsAsync(
				zod.lazy(() => zod.string().transform(async() => {
					await Promise.resolve();
				})),
			),
		).toBe(true);

		interface Category {
			name: string;
			subcategories: Category[];
			test?: string;
		}

		const zodRecursiveSchema: zod.ZodType<Category> = zod.object({
			name: zod.string(),
			subcategories: zod.lazy(() => zodRecursiveSchema.array()),
			test: zod.string().transform(async() => {
				await Promise.resolve();
				return undefined;
			}),
		});

		expect(
			zodSchemaIsAsync(
				zodRecursiveSchema,
			),
		).toBe(true);
	});

	it("map", () => {
		expect(
			zodSchemaIsAsync(
				zod.map(zod.string(), zod.string()),
			),
		).toBe(false);

		expect(
			zodSchemaIsAsync(
				zod.map(
					zod.string().transform(async() => {
						await Promise.resolve();
					}),
					zod.string(),
				),
			),
		).toBe(true);

		expect(
			zodSchemaIsAsync(
				zod.map(
					zod.string(),
					zod.string().transform(async() => {
						await Promise.resolve();
					}),
				),
			),
		).toBe(true);
	});

	it("nullable", () => {
		expect(
			zodSchemaIsAsync(
				zod
					.string()
					.transform(() => 12)
					.nullable(),
			),
		).toBe(false);

		expect(
			zodSchemaIsAsync(
				zod
					.string()
					.transform(async() => {
						await Promise.resolve();
					})
					.nullable(),
			),
		).toBe(true);
	});

	it("object", () => {
		expect(
			zodSchemaIsAsync(
				zod.object({
					test: zod.string(),
					test1: zod.string().transform(() => 12),
				}),
			),
		).toBe(false);

		expect(
			zodSchemaIsAsync(
				zod.object({
					test: zod.string().transform(async() => {
						await Promise.resolve();
					}),
					test1: zod.string().transform(() => 12),
				}),
			),
		).toBe(true);
	});

	it("optional", () => {
		expect(
			zodSchemaIsAsync(
				zod
					.string()
					.transform(() => 12)
					.optional(),
			),
		).toBe(false);

		expect(
			zodSchemaIsAsync(
				zod
					.string()
					.transform(async() => {
						await Promise.resolve();
					})
					.optional(),
			),
		).toBe(true);
	});

	it("pipeline", () => {
		expect(
			zodSchemaIsAsync(zod.pipeline(zod.string(), zod.string())),
		).toBe(false);

		expect(
			zodSchemaIsAsync(
				zod.pipeline(
					zod.string(),
					zod.string().transform(async() => {
						await Promise.resolve();
					}),
				),
			),
		).toBe(true);
	});

	it("promise", () => {
		expect(
			zodSchemaIsAsync(
				zod.promise(zod.string()),
			),
		).toBe(true);
	});

	it("readonly", () => {
		expect(
			zodSchemaIsAsync(
				zod.object({
					test: zod.string(),
					test1: zod.string().transform(() => 12),
				}).readonly(),
			),
		).toBe(false);

		expect(
			zodSchemaIsAsync(
				zod.object({
					test: zod.string().transform(async() => {
						await Promise.resolve();
					}),
					test1: zod.string().transform(() => 12),
				}).readonly(),
			),
		).toBe(true);
	});

	it("record", () => {
		expect(
			zodSchemaIsAsync(
				zod.record(zod.string(), zod.string()),
			),
		).toBe(false);

		expect(
			zodSchemaIsAsync(
				zod.record(zod.string(), zod.string().transform(async() => {
					await Promise.resolve();
				})),
			),
		).toBe(true);
	});

	it("set", () => {
		expect(
			zodSchemaIsAsync(
				zod.set(zod.string()),
			),
		).toBe(false);

		expect(
			zodSchemaIsAsync(
				zod.set(
					zod.string().transform(async() => {
						await Promise.resolve();
					}),
				),
			),
		).toBe(true);
	});

	it("tuple", () => {
		expect(
			zodSchemaIsAsync(
				zod.tuple([zod.string(), zod.string()]).rest(zod.string()),
			),
		).toBe(false);

		expect(
			zodSchemaIsAsync(
				zod.tuple([
					zod.string(),
					zod.string().transform(async() => {
						await Promise.resolve();
					}),
				]).rest(zod.string()),
			),
		).toBe(true);
	});

	it("union", () => {
		expect(
			zodSchemaIsAsync(
				zod.union([
					zod.string(),
					zod.number(),
				]),
			),
		).toBe(false);

		expect(
			zodSchemaIsAsync(
				zod.union([
					zod.string(),
					zod.number().transform(async() => {
						await Promise.resolve();
					}),
				]),
			),
		).toBe(true);
	});
});
