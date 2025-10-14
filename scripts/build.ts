import { type ZodType } from "zod";
import { getDuplicateZodSchema } from "./getDuplicateZodSchema";
import { A, type AnyFunction, not, pipe, when } from "@duplojs/utils";
import { type Builded, hasSymbolBuilded, setSymbolBuildedValue } from "./override";
import { AccelerateValue } from "./accelerateValue";

export function build<
	GenericInnerType extends unknown,
>(
	zodSchema: ZodType<GenericInnerType>,
	accelerator: AccelerateValue.Accelerator[],
) {
	void pipe(
		zodSchema,
		getDuplicateZodSchema,
		A.map(
			when(
				not(hasSymbolBuilded),
				(zodSchema) => {
					setSymbolBuildedValue(zodSchema, undefined);

					build(zodSchema, accelerator);
				},
			),
		),
	);

	return pipe(
		AccelerateValue.find(zodSchema, accelerator, ""),
		(type) => AccelerateValue.create(
			"",
			() => [
				"let $output;",
				AccelerateValue.defineEntrypoint(type, {
					$in: "$input",
					$out: "$output",
				}),
			],
		),
		AccelerateValue.flat,
		({ lines, context }): Builded<GenericInnerType> => ({
			buildedSchema: eval(`
			($input, $context) => {

				${lines.join("\n")}

				return $output
			}
			`) as AnyFunction,
			context: context,
		}),
	);
}
