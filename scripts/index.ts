import z from "zod";
import { build } from "./build";
import { stringMaker } from "./makers/string";
import "@scripts";
import { objectMaker } from "./makers/object";

const testSchema = z.object({
	prop: z.url(),
});

const { buildedSchema, context } = build(testSchema, [stringMaker, objectMaker]);

console.log(
	buildedSchema.toString(),
	context,
	// buildedSchema({ prop: "test" }, context),
	// buildedSchema({}, context),
	// buildedSchema("", context),
);

