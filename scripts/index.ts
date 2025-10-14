import z from "zod";
import { build } from "./build";
import { stringAccelerator } from "./accelerators/string";
import "@scripts";
import { objectAccelerator } from "./accelerators/object";

const testSchema = z.object({ prop: z.string() });

const { buildedSchema, context } = build(testSchema, [stringAccelerator, objectAccelerator]);

console.log(
	buildedSchema.toString(),
	buildedSchema({ prop: "test" }, context),
	buildedSchema({}, context),
	buildedSchema("", context),
);

