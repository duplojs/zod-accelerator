import * as zod from "zod";
import myzod from "myzod";
import { Type as typebox } from "@sinclair/typebox";
import { TypeCompiler as typeboxCompiler } from "@sinclair/typebox/compiler";
import { ZodAccelerator } from "../scripts";
import vine from "@vinejs/vine";
import { Bench } from "tinybench";

const zodSchema = zod.union([
	zod.literal("123"),
	zod.literal("456"),
	zod.object({
		test: zod.string(),
	}),
]);

const myzodSchema = myzod.union([
	myzod.literal("123"),
	myzod.literal("456"),
	myzod.object({
		test: myzod.string(),
	}),
]);
const typeboxSchema = typeboxCompiler.Compile(
	typebox.Union([
		typebox.Literal("123"),
		typebox.Literal("456"),
		typebox.Object({
			test: typebox.String(),
		}),
	]),
);
const vineSchema = vine.compile(
	vine.unionOfTypes([
		vine.string().sameAs("123"),
		// vine.string().sameAs("456"),
		vine.object({
			test: vine.string(),
		}),
	]),
);
const zodAccelerateSchema = ZodAccelerator.build(zodSchema);

const bench = new Bench({ time: 100 });
const data = {
	test: "test",
};

bench
	.add("zod", () => {
		zodSchema.parse(data);
	})
	.add("@sinclair/typebox", () => {
		typeboxSchema.Check(data);
	})
	.add("myzod", () => {
		myzodSchema.parse(data);
	})
	.add("vine", async() => {
		await vineSchema.validate(data);
	})
	.add("zodAccelerator", () => {
		zodAccelerateSchema.parse(data);
	});

await bench.warmup();
await bench.run();

console.log("Result test Union :");
console.table(bench.table());
