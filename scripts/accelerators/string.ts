import { O } from "@duplojs/utils";
import { getZodError } from "@scripts/getZodError";
import { AccelerateValue } from "@scripts/accelerateValue";

export const stringAccelerator = AccelerateValue.createAccelerator(
	O.discriminate("type", "string"),
	(zodSchema, { create }) => {
		const accelerateValue = create(
			({ $input, $output, stop, fromContext }) => [
				`
				if(typeof ${$input} !== ${fromContext("string")}){
					${stop(getZodError(zodSchema, ""))}
				}

				${$output} = ${$input};
				`,
			],
		);

		return accelerateValue;
	},
);
