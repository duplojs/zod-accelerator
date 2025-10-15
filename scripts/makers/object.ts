import { A, O, pipe } from "@duplojs/utils";
import { AccelerateValue } from "@scripts/accelerateValue";
import { type ZodType } from "zod";

export const objectMaker = AccelerateValue.createMaker(
	O.discriminate("type", "object"),
	(zodSchema, { create, make }) => create(
		({ $input, $output, $stop, fromContext }) => {
			const shape = pipe(
				zodSchema.shape as { [key: string]: ZodType },
				O.entries,
				A.map(
					([key, value]) => AccelerateValue.defineEntrypoint(
						make(
							value,
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
					${$stop}
				}

				${$output} = {};
				`,
				...shape,
			];
		},
	),
);
