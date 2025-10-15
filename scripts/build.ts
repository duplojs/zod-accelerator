import { type ZodType } from "zod";
import { getDuplicateZodSchema } from "./getDuplicateZodSchema";
import { A, not, pipe, when } from "@duplojs/utils";
import { type Builded, hasSymbolBuilded, setSymbolBuildedValue } from "./override";
import { AccelerateValue } from "./accelerateValue";

export function build<
	GenericInnerType extends unknown,
>(
	zodSchema: ZodType<GenericInnerType>,
	accelerator: AccelerateValue.Maker[],
) {
	void pipe(
		zodSchema,
		getDuplicateZodSchema,
		A.map(
			when(
				not(hasSymbolBuilded),
				(zodSchema) => {
					setSymbolBuildedValue(zodSchema, undefined);

					setSymbolBuildedValue(zodSchema, build(zodSchema, accelerator));
				},
			),
		),
	);

	return pipe(
		AccelerateValue.make(zodSchema, accelerator, { type: "return" }),
		(type) => AccelerateValue.create(
			{ type: "return" },
			() => [
				AccelerateValue.addLine(
					AccelerateValue.defineEntrypoint(type, {
						$in: "$input",
					}),
					[`return ${type.$output}`],
				),
			],
		),
		AccelerateValue.flat,
		({ lines, context }): Builded<GenericInnerType> => ({
			buildedSchema: eval(`
			($input, $context) => {

				${lines.join("\n")}
			}
			`),
			context: context,
		}),
	);
}
