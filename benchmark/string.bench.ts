import * as zod from "zod";
import joi from "joi";
import myzod from "myzod";
import {Type as typebox} from "@sinclair/typebox";
import {Value as typeboxValue} from "@sinclair/typebox/value";
import {ZodAccelerator} from "../scripts";
import Bench from "tinybench";

const zodSchema = zod.string();
const joiSchema = joi.string();
const myzodSchema = myzod.string();
const typeboxSchema = typebox.String();
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

	console.log("Result test String :");
	console.table(bench.table());
})();
