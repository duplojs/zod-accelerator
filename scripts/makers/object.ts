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
					([key, value]) => pipe(
						make(
							value,
						),
						(type) => AccelerateValue.defineEntrypoint(
							type,
							{
								$in: `${$input}[${fromContext(key)}]`,
							},
						),
						(type) => AccelerateValue.addLine(
							type,
							[
								`
								if(${type.$output} !== undefined){
									${$output}[${fromContext(key)}] = ${type.$output};
								}
								`,
							],
						),
					),
				),
			);

			return [
				`
				if(typeof ${$input} !== ${fromContext("object")}){
					${$stop}
				}

				let ${$output} = {};
				`,
				...shape,
			];
		},
	),
);
