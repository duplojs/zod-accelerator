import * as zod from "zod";
import joi from "joi";
import myzod from "myzod";
import {Type as typebox} from "@sinclair/typebox";
import {TypeCompiler as typeboxCompiler} from "@sinclair/typebox/compiler";
import {ZodAccelerator} from "../scripts";
import vine from "@vinejs/vine";
import Bench from "tinybench";

const zodSchema = zod.string();
const joiSchema = joi.string();
const myzodSchema = myzod.string();
const typeboxSchema = typeboxCompiler.Compile(typebox.String());
const vineSchema = vine.compile(vine.string());
const zodAccelerateSchema = ZodAccelerator.build(zodSchema);

const bench = new Bench({time: 100});
const data = "this is a nice test";

bench
.add("zod", () => {
	zodSchema.parse(data);
})
.add("joi", () => {
	joiSchema.validate(data);
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

(async() => {
	await bench.warmup();
	await bench.run();

	console.log("Result test String :");
	console.table(bench.table());
})();
