import * as zod from "zod";
import joi from "joi";
import myzod from "myzod";
import {Type as typebox} from "@sinclair/typebox";
import {TypeCompiler as typeboxCompiler} from "@sinclair/typebox/compiler";
import {ZodAccelerator} from "../scripts";
import vine from "@vinejs/vine";
import Bench from "tinybench";

const zodSchema = zod.object({
	firstname: zod.string().optional(),
	lastname: zod.string(),
	age: zod.number(),
	email: zod.string(),
	gender: zod.enum(["boy", "girl"]),
	connected: zod.boolean(),
	createdAt: zod.date(),
	addresse: zod.object({
		postCode: zod.string(),
		city: zod.string(),
		number: zod.number()
	}),
});
const joiSchema = joi.object({
	firstname: joi.string().optional(),
	lastname: joi.string(),
	age: joi.number(),
	email: joi.string(),
	gender: joi.string().valid("boy", "girl"),
	connected: joi.boolean(),
	createdAt: joi.date(),
	addresse: joi.object({
		postCode: joi.string(),
		city: joi.string(),
		number: joi.number()
	}),
});
const myzodSchema = myzod.object({
	firstname: myzod.string().optional(),
	lastname: myzod.string(),
	age: myzod.number(),
	email: myzod.string(),
	gender: myzod.enum(["boy", "girl"]),
	connected: myzod.boolean(),
	createdAt: myzod.date(),
	addresse: myzod.object({
		postCode: myzod.string(),
		city: myzod.string(),
		number: myzod.number()
	}),
});
enum typeboxGender {
    boy = "boy",
    girl = "girl"
}
const typeboxSchema = typeboxCompiler.Compile(
	typebox.Object({
		firstname: typebox.Optional(typebox.String()),
		lastname: typebox.String(),
		age: typebox.Number(),
		email: typebox.String(),
		gender: typebox.Enum(typeboxGender),
		connected: typebox.Boolean(),
		createdAt: typebox.Date(),
		addresse: typebox.Object({
			postCode: typebox.String(),
			city: typebox.String(),
			number: typebox.Number()
		}),
	})
);
const vineSchema = vine.compile(
	vine.object({
		firstname: vine.string(),
		lastname: vine.string(),
		age: vine.number(),
		email: vine.string(),
		gender: vine.enum(["boy", "girl"]),
		connected: vine.boolean(),
		// createdAt: vine.date(),
		addresse: vine.object({
			postCode: vine.string(),
			city: vine.string(),
			number: vine.number()
		}),
	})
);
const zodAccelerateSchema = ZodAccelerator.build(zodSchema);

const bench = new Bench({time: 100});

const data = {
	firstname: "  Mike ",
	lastname: "ee",
	age: 21,
	email: "test@gmail.com",
	gender: "girl",
	connected: true,
	createdAt: new Date(),
	addresse: {
		postCode: "22778",
		city: "Paris",
		number: 67
	},
};

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

	console.log("Result test Object :");
	console.table(bench.table());
})();
