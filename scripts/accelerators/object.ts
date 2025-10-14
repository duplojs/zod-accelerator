import { A, O, pipe } from "@duplojs/utils";
import { getZodError } from "@scripts/getZodError";
import { AccelerateValue } from "@scripts/accelerateValue";
import { type ZodType } from "zod";

export const objectAccelerator = AccelerateValue.createAccelerator(
	O.discriminate("type", "object"),
	(zodSchema, { create, find }) => create(
		({ $input, $output, stop, fromContext }) => {
			const shape = pipe(
				zodSchema.shape as { [key: string]: ZodType },
				O.entries,
				A.map(
					([key, value]) => AccelerateValue.defineEntrypoint(
						find(
							value,
							key,
						),
						{
							$in: `${$input}[${fromContext(key)}]`,
							$out: `${$output}[${fromContext(key)}]`,
						},
					),
				),
			);

			return [
				`
				if(typeof ${$input} !== ${fromContext("object")}){
					${stop(getZodError(zodSchema, ""))}
				}

				${$output} = {};
				`,
				...shape,
			];
		},
	),
);
