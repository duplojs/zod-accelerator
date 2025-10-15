import { O } from "@duplojs/utils";
import { AccelerateValue } from "@scripts/accelerateValue";

export const stringMaker = AccelerateValue.createMaker(
	O.discriminate("type", "string"),
	(zodSchema, { create }) => create(
		({ $input, $stop, fromContext }) => [
			`
			if(typeof ${$input} !== ${fromContext("string")}){
				${$stop}
			}
			`,
		],
	),
);
