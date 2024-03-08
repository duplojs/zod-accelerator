import * as zod from "zod";
import joi from "joi";
import myzod from "myzod";
import {Type as typebox} from "@sinclair/typebox";
import {Value as typeboxValue} from "@sinclair/typebox/value";
import {ZodAccelerator} from "../scripts";
import Bench from "tinybench";

const zodSchema = zod.union([
	zod.literal("123"),
	zod.literal("456"),
	zod.object({
		test: zod.string()
	}),
]);
const joiSchema = null;
const myzodSchema = myzod.union([
	myzod.literal("123"),
	myzod.literal("456"),
	myzod.object({
		test: myzod.string()
	}),
]);
const typeboxSchema = typebox.Union([
	typebox.Literal("123"),
	typebox.Literal("456"),
	typebox.Object({
		test: typebox.String()
	}),
]);
const zodAccelerateSchema = ZodAccelerator.build(zodSchema);


const bench = new Bench({time: 100});
const data = {
	test: "test"
};

bench
.add("zod", () => {
	zodSchema.parse(data);
})
.add("joi", () => {
	throw joiSchema;
})
.add("@sinclair/typebox", () => {
	typeboxValue.Check(typeboxSchema, data);
})
.add("myzod", () => {
	myzodSchema.parse(data);
})
.add("zodAccelerator", () => {
	zodAccelerateSchema.parse(data);
});

(async() => {
	await bench.warmup();
	await bench.run();

	console.log("Result test Union :");
	console.table(bench.table());
})();
